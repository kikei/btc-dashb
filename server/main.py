import datetime
import logging
import os
import pymongo
import sys
import json
import hashlib
import flask
from flask_jwt import JWT, jwt_required, current_identity

CWD = os.path.dirname(os.path.abspath(__file__))

sys.path.append(os.path.join(CWD, '..', '..', 'bitcoin_arb', 'app'))
sys.path.append(os.path.join(CWD, '..', '..', 'bitcoin_arb', 'config'))

# import Properties
import LocalProperties

from models import models
from market.BitFlyer import BitFlyer
from market.Quoine import Quoine

from Trader import get_tick_db

tick_db = get_tick_db(LocalProperties.MONGO_HOST,
                      LocalProperties.MONGO_PORT)
models = models(tick_db)

app = flask.Flask(__name__)

app.config['JWT_SECRET_KEY'] = 'bitcoin_dashboard_secret'
app.config['JWT_EXPIRATION_DELTA'] = datetime.timedelta(hours=12)

class User(object):
    def __init__(self, id, username, hashed_password):
        self.id = id
        self.username = username
        self.hashed_password = hashed_password

    def __str__(self):
        return 'aaa'

class Accounts(object):
    def __init__(self):
        self.users = [ User(1, 'fujii', '7d2478a937a51fc947bef2f0c10ad31f5b205619c860b983795515c2e841576825acba4a7eddf4569070f45cc9460ddd9b555f005651e98c964a88dc1c42950e') ]

    def user_by_id(self, id):
        it = filter(lambda u: u.id == id, self.users)
        return next(it, None)

    def lookup_user(self, username, password):
        it = filter(lambda u: u.username == username, self.users)
        user = next(it, None)
        if user is not None and \
           user.hashed_password == Accounts.digest_password(password):
            return user
        else:
            return None    

    @staticmethod
    def digest_password(password):
        return hashlib.sha512(password.encode('utf-8')).hexdigest()

accounts = Accounts()

def authenticate(username, password):
    return accounts.lookup_user(username, password)

def identity(payload):
    user_id = payload['identity']
    return accounts.user_by_id(user_id)

jwt = JWT(app, authenticate, identity)

def inner_product(A, B):
    return sum(a * b for (a, b) in zip(A, B))

def calc_profit(ask, bid, exchangers, ticks):
    ex_ask = exchangers[ask]
    ex_bid = exchangers[bid]
    size_ask = sum(ex_ask['sizes'])
    size_bid = sum(ex_bid['sizes'])
    ammount_ask = inner_product(ex_ask['sizes'], ex_ask['prices'])
    ammount_bid = inner_product(ex_bid['sizes'], ex_bid['prices'])
    profit_ask = size_ask * ticks[ask]['bid'] - ammount_ask
    profit_bid = ammount_bid - size_bid * ticks[bid]['ask']
    return profit_ask + profit_bid

@app.route('/auth/account', methods=['GET'])
@jwt_required()
def get_account():
    user = current_identity
    account = {
        'userid': user.id,
        'username': user.username
    }
    return flask.jsonify(account)

@app.route('/api/flags', methods=['GET'])
@jwt_required()
def get_on():
    onoff = models.Flags.get_is_on()
    return flask.jsonify({'onoff': onoff})

@app.route('/api/flags/<string:key>', methods=['POST'])
@jwt_required()
def post_flag(key):
    inputed = json.loads(flask.request.data.decode())
    value = inputed['value']
    if key == 'onoff' and isinstance(value, bool):
        result = models.Flags.set_is_on(value)
        return flask.jsonify({key: value})
    else:
        flask.abort(404)

@app.route('/api/assets', methods=['GET'])
@jwt_required()
def get_assets():
    bf = BitFlyer(tick_db)
    qn = Quoine(tick_db)

    bf_net_asset = bf.get_net_asset()
    qn_net_asset = qn.get_net_asset()
    
    total_net_asset = bf_net_asset + qn_net_asset
    
    assets = {
        'exchangers': {
            'bitflyer': {
                'net_asset': bf_net_asset
            },
            'quoine': {
                'net_asset': qn_net_asset
            }
        },
        'total': {
            'net_asset': total_net_asset
        }
    }
    return flask.jsonify(assets)

@app.route('/api/conditions', methods=['GET'])
@jwt_required()
def get_conditions():
    open_conditions = models.OpenConditions.all()
    close_profits = models.CloseProfits.all()

    conditions = [
        { 'diff': a['price'],
          'lots': a['lots'],
          'profit': close_profits[a['price']]
        } for a in open_conditions
    ]
    return flask.jsonify({ 'conditions': conditions })

@app.route('/api/conditions', methods=['POST'])
@jwt_required()
def post_conditions():
    inputed = json.loads(flask.request.data.decode())
    print(inputed)
    condition = {
        'diff': int(inputed['diff']),
        'lots': float(inputed['lots']),
        'profit': float(inputed['profit'])
    }
    result = models.OpenConditions.set(condition['diff'], condition['lots'])
    result = models.CloseProfits.set(condition['diff'], condition['profit'])
    return flask.jsonify({ 'condition': condition })

@app.route('/api/conditions/<int:diff>', methods=['DELETE'])
@jwt_required()
def delete_condition(diff):
    result = models.OpenConditions.delete(diff)
    result = models.CloseProfits.delete(diff)
    return flask.jsonify({ 'diff': diff })
 
@app.route('/api/ticks', methods=['GET'])
@jwt_required()
def get_ticks():
    ticks = models.Ticks.one()
    return flask.jsonify({ 'exchangers': ticks })

@app.route('/api/positions', methods=['GET'])
@jwt_required()
def get_positions():
    positions = models.Positions.all()
    ticks = models.Ticks.one()
    for position in positions:
        pnl = calc_profit(position['ask'], position['bid'],
                          position['exchangers'], ticks)
        position['pnl'] = pnl
    return flask.jsonify({ 'positions': positions })

@app.route('/api/exchangers/quoine', methods=['GET'])
@jwt_required()
def get_quoine():
    positions = models.Positions.all()
    ticks = models.Ticks.one()
    
    qn = Quoine(tick_db)
    account = qn.get_account()
    
    trades = qn.get_trades(limit=1000, status='open')
    trades = trades['models']

    # trade id list
    managed_positions = set()

    # build managed_positions
    for position in positions:
        quoine = position['exchangers']['quoine']
        managed_positions |= set(quoine['ids'])
    
    # True managed means the trade is under management of applications.
    # Trades with False managed need to be closed manually.
    for trade in trades:
        trade['managed'] = trade['id'] in managed_positions

    return flask.jsonify({
        'net_asset': account['equity'],
        'free_margin': account['free_margin'],
        'required_margin': account['margin'],
        'keep_rate': account['keep_rate'],
        'tick': ticks['quoine'],
        'positions': trades
    })
    
@app.route('/')
def index():
    title = "BitcoinArb Dashboard"

    return flask.render_template('index.html',
                                 title=title)

@app.route('/<path:path>')
def fallback(path):
    return index()

# /post にアクセスしたときの処理
# @app.route('/post', methods=['GET', 'POST'])
# def post():
#     title = "こんにちは"
#     if flask.request.method == 'POST':
#         # リクエストフォームから「名前」を取得して
#         name = flask.request.form['name']
#         # index.html をレンダリングする
#         return flask.render_template('index.html',
#                                      name=name, title=title)
#     else:
#         # エラーなどでリダイレクトしたい場合はこんな感じで
#         return flask.redirect(flask.url_for('index'))

if __name__ == '__main__':
    app.debug = True # デバッグモード有効化
    app.run(host='0.0.0.0') # どこからでもアクセス可能に
