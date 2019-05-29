import { observable, action, autorun } from 'mobx';
import AuthHelper from '../src/helpers/AuthHelper.js';
import Api from '../src/helpers/Api.js';

class dataWallets {
  @observable wallets = {};

  constructor(Auth, Api) {
    this.Auth = Auth;
    this.Api = Api;
  }

  @action setWallet(address, details) {
    details.address = address;
    this.wallets[address] = details;
  }

  @action removeWallet(address) {
    this.wallets[address] = {};
  }

  fetchWallets(callback) {
    var walletCount = 0;
    var counter = 0;

    this.Api.getWalletList().then(res => {
      walletCount = res.message.addresses.length;
      res.message.addresses && res.message.addresses.forEach(address => {
        this.Api.getWalletDetails(address).then(res => {
          counter++;

          if (res.result === 'success') {
            this.setWallet(address, res.message);
          }

          if (counter == walletCount) {
            callback(true);
          }
        }).catch(e => {
          callback(false);
        });
      });
    }).catch(err => {
      callback(false);
    }).finally(() => {
      // do nothing
    });
  }

  getWallets() {
    var walletsArray = [];
    for (var propertyName in this.wallets) {
      walletsArray.push(this.wallets[propertyName]);
    }
    return walletsArray;
  }
}

class appData {
  constructor() {
    this.Auth = new AuthHelper();
    this.Api = new Api({ auth: this.Auth });

    this.dataWallets = new dataWallets(this.Auth, this.Api);
  }

  login(username, password, token, callback) {
    this.Auth.login(username, password).then(res => {
      if (res.result === 'success') {
        callback(true);
      } else {
        callback(false);
      }
    })
      .catch(err => {
        callback(false);
      })
      .finally(() => {

      });
  }
}

export default new appData();