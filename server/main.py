import logging
import os
import pymongo
import sys
import json

CWD = os.path.dirname(os.path.abspath(__file__))

sys.path.append(os.path.join(CWD, '..', '..', 'bitcoin_arb', 'app'))
sys.path.append(os.path.join(CWD, '..', '..', 'bitcoin_arb', 'config'))

# import Properties
import LocalProperties

from models import models
from market.BitFlyer import BitFlyer
from market.Quoine import Quoine

from Trader import get_tick_db

import flask

tick_db = get_tick_db(LocalProperties.MONGO_HOST,
                      LocalProperties.MONGO_PORT)
models = models(tick_db)

app = flask.Flask(__name__)

@app.route('/api/flags', methods=['GET'])
def get_on():
    onoff = models.Flags.get_is_on()
    return flask.jsonify({'onoff': onoff})

@app.route('/api/flags/<string:key>', methods=['POST'])
def post_flag(key):
    inputed = json.loads(flask.request.data.decode())
    value = inputed['value']
    if key == 'onoff' and isinstance(value, bool):
        result = models.Flags.set_is_on(value)
        return flask.jsonify({key: value})
    else:
        flask.abort(404)

@app.route('/api/assets', methods=['GET'])
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
def delete_condition(diff):
    result = models.OpenConditions.delete(diff)
    result = models.CloseProfits.delete(diff)
    return flask.jsonify({ 'diff': diff })
 
@app.route('/api/ticks', methods=['GET'])
def get_ticks():
    ticks = models.Ticks.one()
    return flask.jsonify({ 'exchangers': ticks })

@app.route('/api/positions', methods=['GET'])
def get_positions():
    positions = models.Positions.all()
    return flask.jsonify({ 'positions': positions })

@app.route('/api/exchangers/quoine', methods=['GET'])
def get_quoine():
    positions = models.Positions.all()
    ticks = models.Ticks.one()
    
    qn = Quoine(tick_db)
    net_asset = qn.get_net_asset()
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
        'net_asset': net_asset,
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
