import Builder from './builder';
import Model from './model';
import { Client, Message } from 'discord.js';

export default class Controller {
  model: Model;
  builder: Builder;
  client: Client;
  constructor() {
    this.model = new Model();
    this.builder = new Builder();
    this.client = new Client();
    this.client.once('ready', () => console.log(`ready to susanoo system`));
    this.onMessage();
    this.client.login(process.env['discordToken']);
  }
  private onMessage() {
    this.client.on('message', (message) => {
      if (message.author.bot) return;
      // 全角・半角で区切る
      // eslint-disable-next-line no-irregular-whitespace
      const messageArray = message.content.split(/[ 　]+/);
      if (messageArray[0] === 'd') {
        if (messageArray[1]) {
          this.susanooDice(message, messageArray[1]);
        } else {
          message.reply('ダイスが指定されていません');
        }
        return;
      }
      if (messageArray[0] !== 'sfb') return;
      switch (messageArray[1]) {
        case 'feato':
          switch (messageArray[2]) {
            case 'kuji':
              this.featoKuji(message);
              return;
            case 'grouping':
              if (messageArray[3]) {
                this.featoGrouping(message, messageArray[3]);
              } else {
                message.channel.send('グループ数が指定されていません');
              }
              return;

            default:
              return;
          }
        case 'fkuji':
          this.featoKuji(message);
          return;
        case 'group':
          if (messageArray[2]) {
            this.featoGrouping(message, messageArray[2]);
          } else {
            message.channel.send('グループ数が指定されていません');
          }
          return;

        case 'honsuzi':
          switch (messageArray[2]) {
            case 'country':
              this.honsuziCountry(message);
              return;
            case 'list':
              this.honsuziList(message);
              return;

            default:
              return;
          }
        case 'ckuji':
          this.honsuziCountry(message);
          return;
        case 'hlist':
          this.honsuziList(message);
          return;

        case 'susanoo':
          switch (messageArray[2]) {
            case 'kuji': {
              const args = messageArray;
              args.splice(0, 3);
              this.susanooKuji(message, ...args);
              return;
            }
            case 'dice':
              if (messageArray[3]) {
                this.susanooDice(message, messageArray[3]);
              } else {
                message.reply('ダイスが指定されていません');
              }
              return;

            default:
              return;
          }
        case 'skuji': {
          const args = messageArray;
          args.splice(0, 2);
          this.susanooKuji(message, ...args);
          return;
        }
        case 'd':
        case 'dice':
          if (messageArray[2]) {
            this.susanooDice(message, messageArray[2]);
          } else {
            message.reply('ダイスが指定されていません');
          }
          return;
        // case 'sshuf': {
        //   const args = messageArray;
        //   args.splice(0, 2);
        //   this.susanooShuffle(message, ...args);
        //   return;
        // }

        case 'help':
        case undefined:
          this.help(message);
          return;

        default:
          return;
      }
    });
  }
  // FEATOの参加者からランダムに一人選ぶくじ（全般用）
  private featoKuji(message: Message) {
    this.model.featoKuji().then((value) => {
      message.channel.send(this.builder.kuji(value));
    });
  }

  private featoGrouping(message: Message, number: string) {
    this.model
      .featoGrouping(number)
      .then((group) => {
        const response = this.builder.grouping(group);
        message.channel.send(response);
      })
      .catch((reason) => {
        if (reason instanceof Error) {
          message.channel.send(reason.message);
        } else {
          message.channel.send('未確認のエラーが発生しました');
        }
      });
  }

  private honsuziList(message: Message) {
    this.model
      .honsuziList()
      .then((json) => message.channel.send(this.builder.list(json)));
  }

  private honsuziCountry(message: Message) {
    this.model.honsuziCountry().then((value) => message.channel.send(value));
  }

  private susanooKuji(message: Message, ...args: string[]) {
    message.reply(this.model.susanooKuji(...args));
  }

  private susanooDice(message: Message, dice: string) {
    try {
      message.reply(this.model.susanooDice(dice));
    } catch (error) {
      if (error instanceof Error) message.reply(error.message);
    }
  }

  // private susanooShuffle(message: Message, ...args: string[]) {}

  private async help(message: Message) {
    let response = '';
    await this.model.loadHelpMD().then((value) => (response = value));
    message.channel.send(response);
  }
}
