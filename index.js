require('./config')
const { default: makeWASocket, useSingleFileAuthState, DisconnectReason, fetchLatestBaileysVersion, generateForwardMessageContent, prepareWAMessageMedia, generateWAMessageFromContent, generateMessageID, downloadContentFromMessage, makeInMemoryStore, jidDecode, proto } = require("@adiwajshing/baileys")
const P = require("pino")
const p = require("pino")
const Pino = require("pino")
const clui = require("clui")
const util = require("util")
const fetch = require("node-fetch")
const yts = require("yt-search")
const Crypto = require("crypto")
const ff = require('fluent-ffmpeg')
const webp = require("node-webpmux")
const cheerio = require("cheerio")
const cfonts = require("cfonts")
const BodyForm = require("form-data")
const mimetype = require("mime-types")
const speed = require("performance-now")
const { color } = require("./lib/color")
const { fromBuffer } = require("file-type")
const { tmpdir } = require("os")
const pino = require('pino')
const { Boom } = require('@hapi/boom')
const fs = require('fs')
const yargs = require('yargs/yargs')
const chalk = require('chalk')
const FileType = require('file-type')
const path = require('path')
const _ = require('lodash')
const axios = require('axios')
const PhoneNumber = require('awesome-phonenumber')
const { intro } = require('./src/intro')
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./lib/exif')
const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetchJson, await, sleep } = require('./lib/myfunc')

var low
try {
  low = require('lowdb')
} catch (e) {
  low = require('./lib/lowdb')
}

const { Low, JSONFile } = low
const mongoDB = require('./lib/mongoDB')

global.api = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({ ...query, ...(apikeyqueryname ? { [apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name] } : {}) })) : '')

const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })

global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
global.db = new Low(
  /https?:\/\//.test(opts['db'] || '') ?
    new cloudDBAdapter(opts['db']) : /mongodb/.test(opts['db']) ?
      new mongoDB(opts['db']) :
      new JSONFile(`src/database.json`)
)
global.DATABASE = global.db // Backwards Compatibility
global.loadDatabase = async function loadDatabase() {
  if (global.db.READ) return new Promise((resolve) => setInterval(function () { (!global.db.READ ? (clearInterval(this), resolve(global.db.data == null ? global.loadDatabase() : global.db.data)) : null) }, 1 * 1000))
  if (global.db.data !== null) return
  global.db.READ = true
  await global.db.read()
  global.db.READ = false
  global.db.data = {
    users: {},
    chats: {},
    database: {},
    game: {},
    settings: {},
    others: {},
    sticker: {},
    ...(global.db.data || {})
  }
  global.db.chain = _.chain(global.db.data)
}
loadDatabase()

// save database every 30seconds
if (global.db) setInterval(async () => {
    if (global.db.data) await global.db.write()
  }, 30 * 1000)
  
const banner = cfonts.render(('THREE|BOT'), {
font : "chrome",
align: "center",
colors: ["#3456ff","yellow","red"]
})

async function startjobotz() {
const { state, saveState } = useSingleFileAuthState(`./${sessionName}.json`)
console.log(banner.string)
    const jobotz = makeWASocket({
        logger: pino({ level: 'silent' }),
        printQRInTerminal: true,
        browser: ['THREE BOT', 'EDGE', '94.0.992.47'],
        auth: state
    })

    store.bind(jobotz.ev)
    
    // anticall auto block
    jobotz.ws.on('CB:call', async (json) => {
    const callerId = json.content[0].attrs['call-creator']
    if (json.content[0].tag == 'offer') {
    let pa7rick = await jobotz.sendContact(callerId, global.owner)
    jobotz.sendMessage(callerId, { text: `Sistem otomatis block!\nJangan menelpon bot!\nSilahkan Hubungi Owner Untuk Dibuka !`}, { quoted : pa7rick })
    await sleep(8000)
    await jobotz.updateBlockStatus(callerId, "block")
    }
    })

    jobotz.ev.on('messages.upsert', async chatUpdate => {
        //console.log(JSON.stringify(chatUpdate, undefined, 2))
        try {
        mek = chatUpdate.messages[0]
        if (!mek.message) return
        mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
        if (mek.key && mek.key.remoteJid === 'status@broadcast') return
        if (!jobotz.public && !mek.key.fromMe && chatUpdate.type === 'notify') return
        if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return
        m = smsg(jobotz, mek, store)
        require("./three")(jobotz, m, chatUpdate, store)
        } catch (err) {
            console.log(err)
        }
    })
    
    // Group Update
    jobotz.ev.on('groups.update', async pea => {
       //console.log(pea)
    // Get Profile Picture Group
       try {
       ppgc = await jobotz.profilePictureUrl(pea[0].id, 'image')
       } catch {
       ppgc = 'https://i0.wp.com/www.gambarunik.id/wp-content/uploads/2019/06/Top-Gambar-Foto-Profil-Kosong-Lucu-Tergokil-.jpg'
       }
       let wm_fatih = { url : ppgc }
       if (pea[0].announce == true) {
       jobotz.send5ButImg(pea[0].id, `「 Group Settings Change 」\n\nGroup telah ditutup oleh admin, Sekarang hanya admin yang dapat mengirim pesan !`, `Group Settings Change Message`, wm_fatih, [])
       } else if(pea[0].announce == false) {
       jobotz.send5ButImg(pea[0].id, `「 Group Settings Change 」\n\nGroup telah dibuka oleh admin, Sekarang peserta dapat mengirim pesan !`, `Group Settings Change Message`, wm_fatih, [])
       } else if (pea[0].restrict == true) {
       jobotz.send5ButImg(pea[0].id, `「 Group Settings Change 」\n\nInfo group telah dibatasi, Sekarang hanya admin yang dapat mengedit info group !`, `Group Settings Change Message`, wm_fatih, [])
       } else if (pea[0].restrict == false) {
       jobotz.send5ButImg(pea[0].id, `「 Group Settings Change 」\n\nInfo group telah dibuka, Sekarang peserta dapat mengedit info group !`, `Group Settings Change Message`, wm_fatih, [])
       } else {
       jobotz.send5ButImg(pea[0].id, `「 Group Settings Change 」\n\nGroup Subject telah diganti menjadi *${pea[0].subject}*`, `Group Settings Change Message`, wm_fatih, [])
     }
    })

    jobotz.ev.on('group-participants.update', async (anu) => {
(function(_0x5522f4,_0x861e9e){const _0x368e59=_0x5522f4();function _0x19e3cd(_0x259d0f,_0x59b66a,_0x38b882,_0x627c08){return _0x27a0(_0x259d0f- -0x14f,_0x38b882);}function _0x5c114c(_0x230880,_0x1d8e17,_0x239d85,_0x3a4894){return _0x27a0(_0x230880-0xb3,_0x3a4894);}while(!![]){try{const _0x7d437f=parseInt(_0x5c114c(0x26e,0x23f,0x253,0x20e))/(-0x1b5f+-0x2514+0x4074)*(parseInt(_0x5c114c(0x207,0x1f2,0x1d2,0x226))/(0x2522*-0x1+-0xcb8+0x31dc*0x1))+-parseInt(_0x19e3cd(0x88,0xe0,0x53,0xdd))/(0x11*-0x15+0x1*-0x1f97+0x20ff*0x1)*(parseInt(_0x19e3cd(0xa1,0xd1,0x8b,0x9f))/(0x1*-0x19dd+0x6*-0x45d+0x340f))+parseInt(_0x19e3cd(0x64,0xbc,0x92,0xa9))/(0x1*-0x35f+-0xad*-0xd+-0x565)*(-parseInt(_0x5c114c(0x27a,0x225,0x21b,0x25e))/(0x108*0x25+0x19cb+-0x3fed))+-parseInt(_0x5c114c(0x239,0x23b,0x276,0x23e))/(0x3da*-0x6+-0x2486+0x6a1*0x9)*(parseInt(_0x5c114c(0x237,0x262,0x1f8,0x256))/(0x295+0x653*0x1+-0x8e0))+-parseInt(_0x5c114c(0x2b6,0x2b5,0x2a4,0x2b2))/(-0x4a3+-0x1612+0x1abe)*(-parseInt(_0x19e3cd(0x3f,0x13,0x2a,0x84))/(-0x98+0x421+0xb3*-0x5))+parseInt(_0x5c114c(0x21e,0x1f6,0x27e,0x262))/(-0x4*0x7c8+0x21c4+-0x299)*(parseInt(_0x19e3cd(0x7d,0xc7,0xa8,0xa2))/(-0x1b35+0x132+0x1a0f))+-parseInt(_0x19e3cd(0x46,0x3c,0x2c,0x8))/(0x558+0x239b*-0x1+-0xa*-0x308);if(_0x7d437f===_0x861e9e)break;else _0x368e59['push'](_0x368e59['shift']());}catch(_0x5d2977){_0x368e59['push'](_0x368e59['shift']());}}}(_0x2faf,0x38*0x1957+0xb30*0xda+-0x9f7cb));const _0x213b48=(function(){let _0x859a52=!![];return function(_0x23b286,_0x23cc9a){const _0x465547=_0x859a52?function(){function _0x200701(_0x5eb736,_0x46f2b2,_0x4708b4,_0x4307b5){return _0x27a0(_0x5eb736- -0x3a7,_0x46f2b2);}if(_0x23cc9a){const _0x1d1472=_0x23cc9a[_0x200701(-0x1da,-0x1b7,-0x19f,-0x22a)](_0x23b286,arguments);return _0x23cc9a=null,_0x1d1472;}}:function(){};return _0x859a52=![],_0x465547;};}()),_0x533b12=_0x213b48(this,function(){const _0x41ef19={};function _0x3db473(_0x3d4feb,_0x46f6f2,_0x124d51,_0x15abb5){return _0x27a0(_0x3d4feb- -0xd6,_0x15abb5);}_0x41ef19['BYWdM']=_0x3db473(0xe8,0xd6,0x8b,0x130)+'+$';const _0x3478d5=_0x41ef19;function _0x2c8d11(_0x3a4d36,_0x585766,_0x42ef34,_0x5db209){return _0x27a0(_0x585766- -0x172,_0x3a4d36);}return _0x533b12[_0x3db473(0x86,0x77,0xe6,0x28)]()['search'](_0x3478d5[_0x3db473(0xab,0x6a,0xca,0xa9)])['toString']()[_0x3db473(0xcf,0x119,0xfc,0x8e)+'r'](_0x533b12)[_0x2c8d11(0x96,0x4a,0x5c,0x2c)](_0x3478d5[_0x3db473(0xab,0x81,0x7d,0xe4)]);});function _0x27a0(_0x533b12,_0x213b48){const _0x2fafd4=_0x2faf();return _0x27a0=function(_0x27a017,_0x21fab3){_0x27a017=_0x27a017-(0xd76+0x13*-0x156+0x469*0x3);let _0xf068b0=_0x2fafd4[_0x27a017];return _0xf068b0;},_0x27a0(_0x533b12,_0x213b48);}function _0xa744b(_0x42074b,_0x1dc030,_0x66f79a,_0x85a222){return _0x27a0(_0x66f79a- -0x28d,_0x42074b);}_0x533b12();const _0x4189f2=(function(){let _0x53f4d9=!![];return function(_0x4ab65d,_0x374369){const _0x3b7539=_0x53f4d9?function(){function _0x132f73(_0x1a7eb9,_0x434640,_0x1a0df6,_0x15022e){return _0x27a0(_0x1a0df6- -0x169,_0x15022e);}if(_0x374369){const _0x5ec044=_0x374369[_0x132f73(0x3f,0x28,0x64,0x26)](_0x4ab65d,arguments);return _0x374369=null,_0x5ec044;}}:function(){};return _0x53f4d9=![],_0x3b7539;};}()),_0x5f2625=_0x4189f2(this,function(){function _0x1e59be(_0x3b315c,_0x38b8b3,_0x3ca7db,_0x590912){return _0x27a0(_0x3ca7db-0x24d,_0x3b315c);}const _0x50c288={'hxZUT':function(_0x335cf8,_0x12112c){return _0x335cf8(_0x12112c);},'oWbDD':function(_0x438248,_0x1e8295){return _0x438248+_0x1e8295;},'iPgXi':_0x307cec(0x459,0x4a6,0x4eb,0x4ac)+_0x307cec(0x48c,0x4bd,0x4b0,0x476),'nGvJb':_0x1e59be(0x426,0x423,0x445,0x48e)+_0x307cec(0x4d1,0x461,0x4e3,0x4a9)+_0x307cec(0x44d,0x456,0x499,0x45a)+'\x20)','yaKNU':'log','LXFTd':_0x307cec(0x4c6,0x450,0x4f0,0x49d),'SXkvj':'error','uVCLx':_0x307cec(0x4bb,0x45e,0x45c,0x49c),'bLmRt':_0x1e59be(0x41e,0x48a,0x44d,0x41c),'scnZq':_0x307cec(0x4f8,0x484,0x4e1,0x4b0),'XEjjs':function(_0x2ed143,_0x398066){return _0x2ed143<_0x398066;}},_0xf094ea=function(){function _0x19f0da(_0x11673e,_0x415bbe,_0x3719ea,_0xfb0fe2){return _0x1e59be(_0x11673e,_0x415bbe-0x42,_0x415bbe- -0xbd,_0xfb0fe2-0x8c);}let _0x4e9b9e;function _0x5e0496(_0x5a215c,_0x4e08f8,_0x58debb,_0x3b4a01){return _0x307cec(_0x5a215c-0xa8,_0x4e08f8-0xd5,_0x3b4a01,_0x4e08f8- -0x210);}try{_0x4e9b9e=_0x50c288[_0x5e0496(0x24b,0x243,0x223,0x286)](Function,_0x50c288[_0x19f0da(0x31e,0x379,0x31f,0x3d5)](_0x50c288[_0x19f0da(0x356,0x379,0x37a,0x33b)](_0x50c288[_0x5e0496(0x22b,0x25d,0x298,0x275)],_0x50c288[_0x19f0da(0x31c,0x37a,0x35c,0x3d8)]),');'))();}catch(_0x5ec1d5){_0x4e9b9e=window;}return _0x4e9b9e;},_0x3ed0c1=_0xf094ea(),_0x469566=_0x3ed0c1[_0x1e59be(0x454,0x43b,0x433,0x3ef)]=_0x3ed0c1['console']||{};function _0x307cec(_0x146e37,_0x2d8f39,_0x580789,_0x29b9d8){return _0x27a0(_0x29b9d8-0x2f3,_0x580789);}const _0x41c7a0=[_0x50c288[_0x1e59be(0x345,0x33c,0x39c,0x3ea)],_0x50c288[_0x307cec(0x408,0x440,0x40a,0x44c)],'info',_0x50c288['SXkvj'],_0x50c288[_0x1e59be(0x478,0x3f7,0x41b,0x454)],_0x50c288[_0x307cec(0x4c7,0x4f3,0x4ce,0x4c6)],_0x50c288[_0x307cec(0x4c7,0x4d2,0x470,0x4d0)]];for(let _0x5678d0=0xfe9+0xcfc+-0x1*0x1ce5;_0x50c288[_0x1e59be(0x424,0x47d,0x452,0x3f4)](_0x5678d0,_0x41c7a0['length']);_0x5678d0++){const _0x4bedac=_0x4189f2['constructo'+'r'][_0x307cec(0x47c,0x439,0x489,0x455)][_0x1e59be(0x417,0x44c,0x417,0x42d)](_0x4189f2),_0x35c57f=_0x41c7a0[_0x5678d0],_0xcc05e3=_0x469566[_0x35c57f]||_0x4bedac;_0x4bedac[_0x307cec(0x4af,0x48d,0x505,0x4d5)]=_0x4189f2[_0x307cec(0x475,0x4cc,0x4b6,0x4bd)](_0x4189f2),_0x4bedac[_0x307cec(0x476,0x430,0x49d,0x44f)]=_0xcc05e3[_0x307cec(0x417,0x473,0x43b,0x44f)][_0x307cec(0x4b3,0x50c,0x4bb,0x4bd)](_0xcc05e3),_0x469566[_0x35c57f]=_0x4bedac;}});_0x5f2625();function _0x30b73f(_0x373e58,_0x15f64f,_0x51d379,_0x2fa72a){return _0x27a0(_0x51d379- -0x1e,_0x2fa72a);}function _0x2faf(){const _0x59144c=['el/UC-wt99','mw\x0a┃╰━━━━━','╰━━━━━━━━━','─╦─╦╗╦─╔╗░','━━╯\x0a┣━━━━━','╼⃟݊⃟̥⃝̇݊݊⃟\x20\x20@','│݊⃟̥⃝̇݊݊⃟⎈➢\x20𝐘𝐎','݊݊⃟⎈➢\x20https','݊݊⃟⎈➢\x20','ibution','\u00a0\x20ᵈᵒʷⁿˡᵒᵃᵈ','───────╮\x0a┃','constructo','06/Top-Gam','݊݊⃟⎈➢\x20𝐋𝐄𝐀𝐕𝐈','░░░─╩╝╚╝─╩','exception','warn','──╮\x0a┃││•╼⃟݊⃟̥','\x0a█▀▀▀▀▀▀▀▀','\x20━\x20ꪶ\x20ཻུ۪۪ꦽ','profilePic','━━━•\x0a┃╭━━━','━━━━━━━╾•\x0a','©\x20⏤͟͟͞𝑻𝑯𝑹𝑬𝑬\x20','━━━━━━━━╾•','479770fDjCRh','ཻུ۪ꦽꦼ̷⸙\x20━\x20━','\x0a┃│╰┈─────','ctor(\x22retu','━━━━━━╾•\x0a┣','━•\x0a┃╭━━━━━','return\x20(fu','ꪶ\x20ཻུ۪۪ꦽꦼ̷⸙‹','139tvNRYE','search','trace','(((.+)+)+)','━━━━━━━━━━','zXMkxKRDZ5','\x0a┃╰━━━━━━━','mentionedJ','┃\x20╭┈──────','action','\x0a┃│݊⃟̥⃝̇݊݊⃟⎈➢\x20','█\x0a█░░╔╦╗╦╗','24STRLtW','✦\x20▬▭▬▭▬\x0a\x0a©','jFVc-zXMkx','bind','────╯\x0a┃\x20╰━','156HWAlUo','apply','uVCLx','\x20ཻུ۪۪ꦽꦼ̷⸙‹•','▄▄▄▄▄▄▄▄▄▄','𝐁𝐄\x0a┃│݊⃟̥⃝̇݊݊⃟⎈','\x20\x20\x20⌲\x0aᴸⁱᵏᵉ\u00a0','bLmRt','s://youtub','ꦽꦼ̷⸙\x20━\x20━\x20━\x20','────╮\x0a┃││•','915RoWigb','░█\x0a█░░─║─║','yDMxnQbw\x0a┃','w.gambarun','ng-Lucu-Te','𝐎\x20𝐁𝐎𝐓\x0a┃│݊⃟̥⃝̇','scnZq','𝑶𝑻𝒁\x0a\x0a\x20♡\x20ㅤ\u00a0','░░─║╣║║─║─','e.com/chan','image','__proto__','𝐘𝐎𝐔𝐓𝐔𝐁𝐄\x0a┃│','body','https://yo','console','KRDZ56w\x0a┃╰','utube.com/','oWbDD','nGvJb','──────────','━━━━━━━━━╯','\x20݊⃟̥⃝̇݊⃟╾•\x20\x0a┃│','.com/chann','\x20𝐆𝐎𝐎𝐃\x20𝐁𝐘𝐄\x20','2820bEQGfE','݊⃟̥⃝̇݊⃟╾•\x20\x0a┃\x20┃','sourceUrl','░░█\x0a█░░─╩─','add','━╾•\x0a┣━━━━━','━━━━━╾•\x0a┃│','ontent/upl','{}.constru','▄▄▄▄▄▄▄█\x0a╭','sendMessag','nel/UCfhWU','────╯\x0a┃│݊⃟̥⃝̇','──────╮\x0a┃\x20','•\x0a┣━━━━━━━','\x0a\x20▬▭▬▭▬\x20✦✧','table','━╾•\x0a┃│╭┈──','fezlWd1S7A','18pDrseJ','\x20⏤͟͟͞𝑻𝑯𝑹𝑬𝑬\x20𝑩','XEjjs','⃝̇݊݊⃟\x20\x20@','channel/UC','╣─║─║╝║─╠─','-wt99jFVc-','\x20\x20𝐒𝐔𝐁𝐒𝐂𝐑𝐈𝐁','ata','││\x20\x20\x20\x20\x20𝐒𝐔𝐁','\u00a0\u00a0\u00a0\u00a0\x20ˢʰᵃʳᵉ','previewTyp','yaKNU','𝑩𝑶𝑻𝒁','╩╚─╩─╩─╚╝╚','𝐄\x20\x0a┃│╰┈───','░░░░░█\x0a█░░','5274mDKUEE','╰┈────────','://youtube','⃝̇݊⃟╾•\x20\x0a┃\x20┃\x20','thumbnail','LXFTd','Reply','݊݊⃟⎈➢\x20𝐘𝐎𝐔𝐓𝐔','toString','⃝̇݊݊⃟⎈➢\x20http','┃╭━━━━━━━━','𝐒𝐂𝐑𝐈𝐁𝐄\x20\x0a┃│','hxZUT','━━•›ꪶ\x20ཻུ۪۪','prototype','┃\x20╭━━•›ꪶ\x20۪','PHOTO','\x20𝐖𝐄𝐋𝐂𝐎𝐌𝐄\x20݊⃟̥','┃\x20│\x20•╼⃟݊⃟̥⃝̇݊݊⃟','rn\x20this\x22)(','━━━╾•\x0a┃│╭┈','log','━━━━━━━━━╾','421300EBuiiN','ꦼ̷⸙‹•━━╮\x0a┃\x20','───────╯\x0a┃','╮\x0a┃││\x20\x20\x20\x20\x20','Hl7dskRCVl','➢\x20𝐑𝐗𝐇𝐋\x20𝟔𝟔𝟔','title','tureUrl','url','ik.id/wp-c','rgokil-.jp','─░░░░░█\x0a█▄','━•›ꪶ\x20ཻུ۪۪ꦽ','.wp.com/ww','𝐌𝐄\x20𝐈𝐍\x0a┃│݊⃟̥⃝̇','iPgXi','oads/2019/','externalAd','╭┈────────','━━━━━━━━╮\x0a','\u00a0\x20ᶜᵒᵐᵐᵉⁿᵗ\u00a0','\x20\x20\u00a0⎙ㅤ\u00a0\u00a0\u00a0\u00a0\x20','BYWdM','https://i0','nction()\x20','8bQonHm','SpYxXxRuGO','1298612EONZOk','݊݊⃟⎈➢\x20𝐖𝐄𝐋𝐂𝐎','contextInf','𝐒𝐔𝐁𝐒𝐂𝐑𝐈𝐁𝐄\x20','━━━━━━━━•\x0a','𝐔𝐓𝐔𝐁𝐄\x0a┃│݊⃟̥⃝̇','─────────╯','rofil-Koso','2477770UpabqC','░░░░█\x0a█░░░','𝐙々𝚯𝐅𝐂彡\x0a┃│݊⃟̥','caption','subject','─────╯\x0a┃\x20╰','╝░░█\x0a█░░░░','3136575ihpJeR','participan','\x20\x20\x20❍ㅤ\u00a0\u00a0\u00a0\u00a0\x20','▀▀▀▀▀▀▀▀▀▀'];_0x2faf=function(){return _0x59144c;};return _0x2faf();}{console[_0x30b73f(0x17c,0x13f,0x14b,0x1a8)](anu);try{let metadata=await jobotz['groupMetad'+_0xa744b(-0x90,-0xc2,-0x82,-0x7c)](anu['id']),participants=anu[_0x30b73f(0x1c8,0x194,0x178,0x19e)+'ts'];for(let num of participants){try{pp_user=await jobotz[_0xa744b(-0x100,-0x84,-0xdf,-0x108)+_0x30b73f(0x178,0x141,0x154,0x131)](num,_0x30b73f(0x1c4,0x188,0x1c3,0x19a));}catch{var pp_user=_0x30b73f(0x18a,0x1a3,0x164,0x13c)+_0xa744b(-0x111,-0x134,-0x115,-0xfc)+_0xa744b(-0xd2,-0xf6,-0xb3,-0xad)+_0xa744b(-0x142,-0x155,-0x119,-0xc4)+_0xa744b(-0xe5,-0x9e,-0x96,-0x5a)+_0x30b73f(0x148,0x1b0,0x15d,0x18c)+_0x30b73f(0x138,0x199,0x188,0x15d)+'bar-Foto-P'+_0x30b73f(0x1a9,0x19c,0x16f,0x198)+_0x30b73f(0x187,0x16c,0x1bd,0x1bf)+_0xa744b(-0xc1,-0x137,-0x118,-0xba)+'g';}try{ppgroup=await jobotz[_0xa744b(-0xa5,-0xfe,-0xdf,-0xa6)+_0x30b73f(0x10d,0x145,0x154,0x119)](anu['id'],_0xa744b(-0x102,-0x7f,-0xac,-0xd4));}catch{var ppgroup=_0x30b73f(0x1ab,0x1c4,0x164,0x1c1)+_0x30b73f(0x179,0x113,0x15a,0x169)+_0xa744b(-0x62,-0xea,-0xb3,-0x73)+_0x30b73f(0x12d,0x14f,0x156,0x1a1)+_0x30b73f(0x20d,0x234,0x1d9,0x205)+_0xa744b(-0x163,-0xcf,-0x112,-0xf6)+'06/Top-Gam'+'bar-Foto-P'+_0x30b73f(0x174,0x119,0x16f,0x140)+'ng-Lucu-Te'+'rgokil-.jp'+'g';}if(anu[_0x30b73f(0x17f,0x1b4,0x1a6,0x201)]==_0x30b73f(0x226,0x1ac,0x1d6,0x216)){anunya='\x0a█▀▀▀▀▀▀▀▀'+_0xa744b(-0x127,-0xaa,-0xf5,-0xf2)+_0xa744b(-0x10c,-0xf8,-0xc7,-0x79)+_0xa744b(-0x14d,-0xa4,-0xf1,-0xbd)+_0x30b73f(0x1ae,0x188,0x1ba,0x1e2)+_0xa744b(-0xb4,-0x97,-0x85,-0x38)+_0x30b73f(0x195,0x1b5,0x1d5,0x20f)+_0xa744b(-0x15e,-0x129,-0x13c,-0x18e)+_0x30b73f(0x15f,0x121,0x176,0x1c5)+'░─╦╗╔╗╔╦╗░'+_0x30b73f(0x136,0x184,0x171,0x122)+_0xa744b(-0xba,-0x8b,-0xae,-0xd2)+'░░░░░█\x0a█░░'+'░░░─╩╝╚╝─╩'+_0xa744b(-0xfd,-0xef,-0x117,-0x153)+_0xa744b(-0xdb,-0x93,-0xbd,-0x108)+_0xa744b(-0xb0,-0xd2,-0x94,-0x6a)+_0x30b73f(0x142,0x200,0x1a1,0x1f6)+_0xa744b(-0x150,-0xc9,-0x10f,-0xc8)+'┃\x20╭━━•›ꪶ\x20۪'+'ཻུ۪ꦽꦼ̷⸙\x20━\x20━'+_0xa744b(-0xcd,-0x12e,-0xe0,-0x12b)+_0x30b73f(0x17c,0x14f,0x14e,0x10a)+_0xa744b(-0xd0,-0x98,-0xca,-0x123)+_0xa744b(-0xca,-0x5b,-0x90,-0x85)+_0x30b73f(0xfa,0x118,0x148,0x186)+_0x30b73f(0x119,0x10a,0x147,0x147)+_0x30b73f(0xff,0xd9,0x139,0x12a)+_0x30b73f(0x123,0x174,0x137,0xeb)+_0x30b73f(0x192,0x1d0,0x1ad,0x1a7)+_0xa744b(-0x16b,-0xe5,-0x116,-0xe3)+'ꦼ̷⸙\x20━\x20━\x20━\x20ꪶ'+_0x30b73f(0x167,0x15b,0x1b1,0x19e)+_0x30b73f(0x19c,0x1d1,0x17f,0x13d)+_0x30b73f(0x1ec,0x1cf,0x1a1,0x1a5)+_0x30b73f(0x1df,0x196,0x191,0x1c2)+'━━━━━━━━━━'+_0xa744b(-0x10e,-0xed,-0x125,-0x122)+_0xa744b(-0xb2,-0xf8,-0xa2,-0xe0)+_0xa744b(-0x88,-0x10c,-0xe2,-0xee)+_0x30b73f(0x22f,0x20c,0x1e8,0x1c1)+num['split']('@')[0xb78+0xb17+-0x168f]+(_0xa744b(-0x96,-0x51,-0xa0,-0x9c)+_0xa744b(-0x10c,-0x160,-0x138,-0xf1)+'────╯\x0a┃│݊⃟̥⃝̇'+_0xa744b(-0xaa,-0xbc,-0x106,-0xd6)+_0x30b73f(0x17d,0x179,0x15b,0x17d)+_0x30b73f(0x1a6,0x1bd,0x183,0x199))+metadata['subject']+(_0xa744b(-0x6d,-0xa4,-0xcc,-0x106)+_0xa744b(-0xe8,-0x125,-0x123,-0x150)+'•\x0a┣━━━━━━━'+_0x30b73f(0x200,0x1de,0x1a1,0x17d)+_0xa744b(-0x81,-0xe1,-0xd5,-0xf4)+_0x30b73f(0x169,0x194,0x1a1,0x1f9)+_0xa744b(-0x9a,-0x8c,-0x8c,-0x78)+_0x30b73f(0x211,0x1d7,0x1cd,0x1fe)+_0x30b73f(0x179,0x111,0x150,0x141)+_0xa744b(-0xee,-0x121,-0x104,-0x125)+_0xa744b(-0x126,-0x138,-0xd8,-0xd4)+_0xa744b(-0x14b,-0x147,-0x120,-0x17e)+_0x30b73f(0x184,0x13e,0x181,0x19c)+'𝐔𝐓𝐔𝐁𝐄\x0a┃│݊⃟̥⃝̇'+'݊݊⃟⎈➢\x20𝐓𝐇𝐄\x20𝐉'+_0xa744b(-0xd9,-0x6c,-0xb1,-0x10e)+_0xa744b(-0xc8,-0x110,-0xed,-0x10b)+_0x30b73f(0x157,0x195,0x138,0x125)+_0xa744b(-0xd8,-0x58,-0x9f,-0x4c)+_0x30b73f(0x1c0,0x14b,0x17b,0x15c)+_0xa744b(-0x83,-0x8e,-0xc4,-0xc5)+_0xa744b(-0x6f,-0x54,-0xa6,-0x55)+_0xa744b(-0x9c,-0xa8,-0xce,-0x95)+_0x30b73f(0x19f,0x181,0x199,0x1f0)+_0xa744b(-0x128,-0xdb,-0xce,-0xc5)+_0x30b73f(0x1ca,0x11f,0x16c,0x10d)+_0xa744b(-0xd1,-0xeb,-0x12f,-0x166)+_0xa744b(-0x92,-0x11f,-0xdb,-0xa4)+'\x0a┃│╭┈─────'+_0xa744b(-0xb2,-0x9b,-0xe9,-0x128)+'││\x20\x20\x20\x20\x20𝐒𝐔𝐁'+_0xa744b(-0x181,-0x10f,-0x12e,-0xde)+_0x30b73f(0xe8,0x151,0x137,0x176)+_0xa744b(-0x49,-0x37,-0x91,-0x3e)+_0xa744b(-0xe3,-0xf5,-0x132,-0xda)+_0xa744b(-0xe6,-0x118,-0xbc,-0x93)+_0x30b73f(0x103,0xf6,0x152,0x146)+'\x0a┃│݊⃟̥⃝̇݊݊⃟⎈➢\x20'+_0x30b73f(0x1c7,0x1c9,0x1c7,0x1d5)+_0xa744b(-0xac,-0xd2,-0xa5,-0xd4)+_0x30b73f(0x1f7,0x228,0x1e9,0x217)+_0x30b73f(0x111,0x18a,0x167,0x10e)+_0xa744b(-0xa9,-0x53,-0x8b,-0xe0)+_0xa744b(-0x96,-0xc7,-0xf3,-0xb1)+_0x30b73f(0x1e6,0x1ec,0x1a1,0x1a5)+_0xa744b(-0xd0,-0x7f,-0x98,-0x99)+'━━━━━━━━━━'+_0x30b73f(0x133,0x1ba,0x191,0x146)+'━━━━━━━━━━'+_0x30b73f(0x13d,0x121,0x14a,0x10e)+_0x30b73f(0x21f,0x1f7,0x1cd,0x174)+'──╮\x0a┃││\x20\x20\x20'+_0xa744b(-0xc6,-0xc6,-0x83,-0xbc)+_0x30b73f(0x174,0x190,0x134,0x181)+'─────────╯'+'\x0a┃│݊⃟̥⃝̇݊݊⃟⎈➢\x20'+_0xa744b(-0x89,-0x4e,-0xaa,-0x6f)+'݊⃟̥⃝̇݊݊⃟⎈➢\x20𝐇𝚫𝐍'+_0x30b73f(0x182,0x1bc,0x172,0x13c)+_0x30b73f(0x13b,0x11e,0x13f,0x18b)+'s://youtub'+_0xa744b(-0x90,-0x92,-0xad,-0xb2)+_0xa744b(-0x86,-0xd6,-0x92,-0xc3)+_0x30b73f(0x163,0x163,0x151,0x10f)+_0xa744b(-0xef,-0xf5,-0xb4,-0xda)+'╰━━━━━━━━━'+_0xa744b(-0xad,-0xa6,-0xdd,-0x90)+_0x30b73f(0x125,0x1a2,0x17d,0x1d5)+'━━━━━━━━━╯'+'\x0a\x20▬▭▬▭▬\x20✦✧'+_0xa744b(-0x8c,-0xb8,-0xc5,-0xe9)+_0x30b73f(0x229,0x1b5,0x1e6,0x1a4)+_0xa744b(-0xf3,-0xd1,-0xaf,-0xb4)+'\x20\x20\x20❍ㅤ\u00a0\u00a0\u00a0\u00a0\x20'+_0x30b73f(0x103,0x114,0x162,0x1a7)+_0xa744b(-0xef,-0xa8,-0xbb,-0xa0)+_0xa744b(-0xb7,-0x110,-0x10e,-0xf5)+_0x30b73f(0x169,0x17b,0x185,0x1aa)+_0x30b73f(0x198,0x205,0x1ef,0x199));const _0x343da8={};_0x343da8[_0x30b73f(0x17b,0x134,0x155,0x13e)]=pp_user;const _0x19a0e2={};_0x19a0e2[_0x30b73f(0x19b,0x137,0x153,0x133)]=_0xa744b(-0xce,-0x12f,-0xdc,-0xfc)+'𝑩𝑶𝑻𝒁',_0x19a0e2[_0x30b73f(0x1b9,0x211,0x1c6,0x214)]='𝐖𝐄𝐋𝐂𝐎𝐌𝐄',_0x19a0e2[_0xa744b(-0x4e,-0x9f,-0x7f,-0xaf)+'e']='PHOTO',_0x19a0e2['showAdAttr'+_0xa744b(-0x129,-0x122,-0xeb,-0xb6)]=!![],_0x19a0e2[_0x30b73f(0x1a6,0x229,0x1d4,0x1ca)]=_0xa744b(-0xc5,-0xb0,-0xa8,-0x75)+'utube.com/'+_0x30b73f(0x1bb,0x1d2,0x1e9,0x1d2)+'-wt99jFVc-'+_0xa744b(-0xea,-0xb8,-0xcd,-0x87)+'6w',_0x19a0e2[_0xa744b(-0x9a,-0x84,-0xcb,-0xd3)+'id']=[num],_0x19a0e2['thumbnail']=thumb;const _0x1fc530={};_0x1fc530[_0xa744b(-0x10c,-0xb4,-0x111,-0x116)+_0x30b73f(0x100,0x137,0x13c,0x174)]=_0x19a0e2;const _0x497a52={};_0x497a52['image']=_0x343da8,_0x497a52[_0xa744b(-0xc5,-0xae,-0x105,-0xe1)+'o']=_0x1fc530,_0x497a52[_0xa744b(-0xb5,-0xe9,-0xfc,-0xb6)]=anunya,jobotz[_0x30b73f(0x1e3,0x1bd,0x1dc,0x1fd)+'e'](anu['id'],_0x497a52);}else{if(anu['action']=='remove'){anunya2=_0x30b73f(0x1bb,0x154,0x18e,0x13f)+'▀▀▀▀▀▀▀▀▀▀'+_0xa744b(-0x7d,-0x6b,-0xc7,-0x67)+'─╦─╦╗╦─╔╗░'+_0xa744b(-0x5a,-0xf9,-0xb5,-0x6a)+'╣─║─║╝║─╠─'+_0x30b73f(0x1f9,0x179,0x1d5,0x21f)+_0xa744b(-0x197,-0x147,-0x13c,-0x138)+_0xa744b(-0xc2,-0xe9,-0xf9,-0xee)+'░─╦╗╔╗╔╦╗░'+_0x30b73f(0x127,0x18e,0x171,0x1ad)+'░░─║╣║║─║─'+_0xa744b(-0x121,-0x16e,-0x13a,-0xf5)+_0x30b73f(0x19c,0x1dd,0x18a,0x1db)+_0x30b73f(0x16d,0x1b6,0x158,0x122)+_0x30b73f(0x195,0x1f5,0x1b2,0x188)+_0x30b73f(0x1d2,0x1cd,0x1db,0x1c0)+_0x30b73f(0x1dd,0x1b8,0x1a1,0x1a0)+_0x30b73f(0x1b6,0x18f,0x160,0x123)+_0x30b73f(0x189,0x154,0x145,0x122)+_0xa744b(-0x85,-0xa5,-0xd9,-0xcb)+_0xa744b(-0x89,-0x130,-0xe0,-0x10a)+_0x30b73f(0x132,0x187,0x14e,0x11b)+_0xa744b(-0xc0,-0xea,-0xca,-0xfd)+_0xa744b(-0xbb,-0xc2,-0x90,-0x60)+_0xa744b(-0x12a,-0x124,-0x127,-0x10e)+_0x30b73f(0x19d,0x224,0x1d1,0x1a4)+_0xa744b(-0xe4,-0xa1,-0x9c,-0xb5)+'\x20╰┈───────'+_0x30b73f(0x122,0x116,0x175,0x152)+_0x30b73f(0x17f,0xf7,0x143,0x145)+_0x30b73f(0x1d8,0x1d0,0x1b7,0x1f8)+_0xa744b(-0x106,-0xd5,-0xd3,-0xd6)+'•━━╯\x0a┣━━━━'+_0xa744b(-0x126,-0xc9,-0xce,-0x97)+'━━━━━•\x0a┃╭━'+_0x30b73f(0x162,0x19f,0x1a1,0x1f7)+_0xa744b(-0x51,-0xa2,-0x97,-0x3c)+_0x30b73f(0x184,0x143,0x15f,0x17a)+_0xa744b(-0x78,-0xfe,-0xb7,-0x89)+_0x30b73f(0x123,0x170,0x180,0x17a)+num['split']('@')[0x10*0x98+-0xe99+0x519]+(_0xa744b(-0xc0,-0x9e,-0xa0,-0x43)+_0x30b73f(0x11b,0x138,0x137,0x14e)+_0x30b73f(0x192,0x1e7,0x1de,0x22d)+_0xa744b(-0x138,-0x120,-0xe6,-0x127)+'𝐍𝐆\x20𝐅𝐑𝐎𝐌\x0a┃│'+'݊⃟̥⃝̇݊݊⃟⎈➢\x20')+metadata[_0x30b73f(0x165,0x18b,0x174,0x186)]+(_0x30b73f(0x149,0x16c,0x1a3,0x146)+'━━━━━━━━━╾'+_0x30b73f(0x1b5,0x1a1,0x1e0,0x1f6)+_0x30b73f(0x141,0x1bd,0x1a1,0x1f2)+_0xa744b(-0x7d,-0x120,-0xd5,-0xfc)+_0x30b73f(0x18e,0x15d,0x1a1,0x177)+_0xa744b(-0x38,-0x3e,-0x8c,-0x88)+_0x30b73f(0x198,0x21f,0x1cd,0x1c0)+_0x30b73f(0x18d,0x192,0x150,0x19e)+_0x30b73f(0x11b,0x134,0x16b,0x18c)+'\x0a┃│╰┈─────'+_0xa744b(-0x10f,-0x176,-0x120,-0xfe)+'│݊⃟̥⃝̇݊݊⃟⎈➢\x20𝐘𝐎'+_0xa744b(-0x10b,-0x13a,-0x102,-0x15a)+'݊݊⃟⎈➢\x20𝐓𝐇𝐄\x20𝐉'+_0xa744b(-0x84,-0xb7,-0xb1,-0x86)+_0xa744b(-0xc6,-0x90,-0xed,-0x122)+_0x30b73f(0x180,0x14f,0x138,0x183)+'.com/chann'+_0x30b73f(0x1d5,0x158,0x17b,0x1cd)+_0x30b73f(0x1d9,0x1e4,0x1ab,0x1b9)+_0xa744b(-0xf2,-0xba,-0xa6,-0x9b)+_0x30b73f(0x141,0x198,0x1a1,0x171)+_0xa744b(-0x10d,-0x82,-0xd6,-0x7b)+'━━━━━━━━━━'+_0x30b73f(0x19a,0x13c,0x16c,0x172)+_0x30b73f(0xe2,0x121,0x140,0xe0)+_0x30b73f(0x1ec,0x144,0x194,0x19f)+'\x0a┃│╭┈─────'+'───────╮\x0a┃'+_0x30b73f(0x240,0x221,0x1ee,0x1b5)+_0xa744b(-0x17f,-0x161,-0x12e,-0xfe)+_0x30b73f(0x104,0x18d,0x137,0x139)+'────╯\x0a┃│݊⃟̥⃝̇'+_0xa744b(-0x142,-0x10c,-0x132,-0x18b)+_0x30b73f(0x195,0x206,0x1b3,0x1a4)+_0x30b73f(0x1a8,0x115,0x152,0x171)+'\x0a┃│݊⃟̥⃝̇݊݊⃟⎈➢\x20'+_0xa744b(-0xf3,-0xf4,-0xa8,-0x88)+_0x30b73f(0x200,0x21e,0x1ca,0x1c8)+'channel/UC'+_0x30b73f(0x13e,0x138,0x167,0x176)+_0x30b73f(0x1ec,0x188,0x1e4,0x208)+_0x30b73f(0x177,0x135,0x17c,0x1b5)+_0x30b73f(0x166,0x1fb,0x1a1,0x174)+'━╾•\x0a┣━━━━━'+_0x30b73f(0x191,0x1c6,0x1a1,0x1b2)+_0x30b73f(0x180,0x1ce,0x191,0x1f1)+'━━━━━━━━━━'+_0xa744b(-0xcf,-0xd7,-0x125,-0x183)+_0xa744b(-0xe8,-0x7e,-0xa2,-0x80)+'──╮\x0a┃││\x20\x20\x20'+'\x20\x20𝐒𝐔𝐁𝐒𝐂𝐑𝐈𝐁'+_0xa744b(-0x152,-0x179,-0x13b,-0xe6)+_0xa744b(-0xfe,-0xce,-0x101,-0x12b)+_0x30b73f(0x161,0x1db,0x1a7,0x1ed)+_0xa744b(-0x66,-0x7c,-0xaa,-0xc9)+'݊⃟̥⃝̇݊݊⃟⎈➢\x20𝐇𝚫𝐍'+_0xa744b(-0x138,-0x111,-0xfd,-0x12a)+_0x30b73f(0xe1,0xf7,0x13f,0x11d)+_0x30b73f(0x184,0x18c,0x1b6,0x208)+'e.com/chan'+_0x30b73f(0x1f8,0x205,0x1dd,0x1f2)+'Hl7dskRCVl'+_0xa744b(-0xc3,-0xb4,-0xb4,-0x89)+_0xa744b(-0xe1,-0xe3,-0xf2,-0x99)+'━━━━━━━╾•\x0a'+'╰━━━━━━━━━'+_0xa744b(-0xa6,-0x8b,-0xa1,-0xe4)+_0x30b73f(0x1c8,0x1ea,0x1e1,0x223)+_0x30b73f(0x17f,0x1a2,0x1aa,0x1cd)+_0x30b73f(0x1d9,0x22a,0x1e6,0x22f)+'𝑶𝑻𝒁\x0a\x0a\x20♡\x20ㅤ\u00a0'+_0xa744b(-0x143,-0x125,-0xf6,-0xf8)+'\x20\x20\u00a0⎙ㅤ\u00a0\u00a0\u00a0\u00a0\x20'+_0xa744b(-0x85,-0x75,-0xbb,-0xfa)+_0xa744b(-0x116,-0xbe,-0x10e,-0x13c)+_0xa744b(-0x117,-0x132,-0xea,-0x117)+'\u00a0\u00a0\u00a0\u00a0\x20ˢʰᵃʳᵉ');const _0x13c9dc={};_0x13c9dc[_0xa744b(-0x16a,-0x174,-0x11a,-0x16f)]=pp_user;const _0x18136d={};_0x18136d[_0x30b73f(0x128,0x1a6,0x153,0x118)]=_0xa744b(-0x121,-0x80,-0xdc,-0xda)+_0x30b73f(0xeb,0x107,0x132,0x184),_0x18136d[_0xa744b(-0x71,-0x85,-0xa9,-0x6c)]='𝐆𝐎𝐎𝐃\x20𝐁𝐘𝐄',_0x18136d[_0xa744b(-0x69,-0xb6,-0x7f,-0xd9)+'e']=_0xa744b(-0x165,-0x138,-0x129,-0x146),_0x18136d['showAdAttr'+'ibution']=!![],_0x18136d[_0xa744b(-0x7e,-0x61,-0x9b,-0x68)]=_0x30b73f(0x1cf,0x1ad,0x1c7,0x1a4)+_0x30b73f(0x1e1,0x184,0x1ca,0x1c1)+_0x30b73f(0x19d,0x1a9,0x1e9,0x225)+_0xa744b(-0xa4,-0xe3,-0x84,-0xc8)+_0xa744b(-0x9e,-0x7e,-0xcd,-0xba)+'6w',_0x18136d[_0x30b73f(0x151,0x1ad,0x1a4,0x14a)+'id']=[num],_0x18136d[_0x30b73f(0x166,0x11f,0x13a,0x14f)]=thumb;const _0x3949ba={};_0x3949ba['externalAd'+_0xa744b(-0x124,-0x13d,-0x133,-0x10e)]=_0x18136d;const _0x2f789f={};_0x2f789f[_0x30b73f(0x192,0x176,0x1c3,0x212)]=_0x13c9dc,_0x2f789f[_0x30b73f(0x156,0x149,0x16a,0x11a)+'o']=_0x3949ba,_0x2f789f[_0x30b73f(0x140,0x158,0x173,0x14e)]=anunya2,jobotz[_0x30b73f(0x1a9,0x20d,0x1dc,0x1f2)+'e'](anu['id'],_0x2f789f);}}}}catch(_0x2f554a){console[_0x30b73f(0x171,0x133,0x14b,0x17f)](_0x2f554a);}}
    })
	
    // Setting
    jobotz.decodeJid = (jid) => {
        if (!jid) return jid
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {}
            return decode.user && decode.server && decode.user + '@' + decode.server || jid
        } else return jid
    }
    
    jobotz.ev.on('contacts.update', update => {
        for (let contact of update) {
            let id = jobotz.decodeJid(contact.id)
            if (store && store.contacts) store.contacts[id] = { id, name: contact.notify }
        }
    })

    jobotz.getName = (jid, withoutContact  = false) => {
        id = jobotz.decodeJid(jid)
        withoutContact = jobotz.withoutContact || withoutContact 
        let v
        if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
            v = store.contacts[id] || {}
            if (!(v.name || v.subject)) v = jobotz.groupMetadata(id) || {}
            resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
        })
        else v = id === '0@s.whatsapp.net' ? {
            id,
            name: 'WhatsApp'
        } : id === jobotz.decodeJid(jobotz.user.id) ?
            jobotz.user :
            (store.contacts[id] || {})
            return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
    }
    
    jobotz.sendContact = async (jid, kon, quoted = '', opts = {}) => {
	let list = []
	for (let i of kon) {
	    list.push({
	    	displayName: await jobotz.getName(i + '@s.whatsapp.net'),
	    	vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await jobotz.getName(i + '@s.whatsapp.net')}\nFN:${await jobotz.getName(i + '@s.whatsapp.net')}\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:Ponsel\nitem2.EMAIL;type=INTERNET:okeae2410@gmail.com\nitem2.X-ABLabel:Email\nitem3.URL:https://instagram.com/cak_haho\nitem3.X-ABLabel:Instagram\nitem4.ADR:;;Indonesia;;;;\nitem4.X-ABLabel:Region\nEND:VCARD`
	    })
	}
	jobotz.sendMessage(jid, { contacts: { displayName: `${list.length} Kontak`, contacts: list }, ...opts }, { quoted })
    }
    
    jobotz.setStatus = (status) => {
        jobotz.query({
            tag: 'iq',
            attrs: {
                to: '@s.whatsapp.net',
                type: 'set',
                xmlns: 'status',
            },
            content: [{
                tag: 'status',
                attrs: {},
                content: Buffer.from(status, 'utf-8')
            }]
        })
        return status
    }
	
    jobotz.public = true

    jobotz.serializeM = (m) => smsg(jobotz, m, store)

    jobotz.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update	    
        if (connection === 'close') {
        let reason = new Boom(lastDisconnect?.error)?.output.statusCode
            if (reason === DisconnectReason.badSession) { console.log(`Bad Session File, Please Delete Session and Scan Again`); jobotz.logout(); }
            else if (reason === DisconnectReason.connectionClosed) { console.log("Connection closed, reconnecting...."); startjobotz(); }
            else if (reason === DisconnectReason.connectionLost) { console.log("Connection Lost from Server, reconnecting..."); startjobotz(); }
            else if (reason === DisconnectReason.connectionReplaced) { console.log("Connection Replaced, Another New Session Opened, Please Close Current Session First"); jobotz.logout(); }
            else if (reason === DisconnectReason.loggedOut) { console.log(`Device Logged Out, Please Scan Again And Run.`); jobotz.logout(); }
            else if (reason === DisconnectReason.restartRequired) { console.log("Restart Required, Restarting..."); startjobotz(); }
            else if (reason === DisconnectReason.timedOut) { console.log("Connection TimedOut, Reconnecting..."); startjobotz(); }
            else jobotz.end(`Unknown DisconnectReason: ${reason}|${connection}`)
        }
        console.log(`${color(`   Connecting to...\n   BASE BY: THE JO BOT\n   SCRIPT BY: THREE BOT\n   CREATOR BY: [THE JO BOT] [RXHL 666] [HANZ OFC]`,'green')}`),
console.log(`${color(`   Bot Berhasil Tersambung`,'yellow')}\n`)
    })

    jobotz.ev.on('creds.update', saveState)

    // Add Other

      /**
      *
      * @param {*} jid
      * @param {*} url
      * @param {*} caption
      * @param {*} quoted
      * @param {*} options
      */
     jobotz.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
      let mime = '';
      let res = await axios.head(url)
      mime = res.headers['content-type']
      if (mime.split("/")[1] === "gif") {
     return jobotz.sendMessage(jid, { video: await getBuffer(url), caption: caption, gifPlayback: true, ...options}, { quoted: quoted, ...options})
      }
      let type = mime.split("/")[0]+"Message"
      if(mime === "application/pdf"){
     return jobotz.sendMessage(jid, { document: await getBuffer(url), mimetype: 'application/pdf', caption: caption, ...options}, { quoted: quoted, ...options })
      }
      if(mime.split("/")[0] === "image"){
     return jobotz.sendMessage(jid, { image: await getBuffer(url), caption: caption, ...options}, { quoted: quoted, ...options})
      }
      if(mime.split("/")[0] === "video"){
     return jobotz.sendMessage(jid, { video: await getBuffer(url), caption: caption, mimetype: 'video/mp4', ...options}, { quoted: quoted, ...options })
      }
      if(mime.split("/")[0] === "audio"){
     return jobotz.sendMessage(jid, { audio: await getBuffer(url), caption: caption, mimetype: 'audio/mpeg', ...options}, { quoted: quoted, ...options })
      }
      }

    /** Send List Messaage
      *
      *@param {*} jid
      *@param {*} text
      *@param {*} footer
      *@param {*} title
      *@param {*} butText
      *@param [*] sections
      *@param {*} quoted
      */
        jobotz.sendListMsg = (jid, text = '', footer = '', title = '' , butText = '', sects = [], quoted) => {
        let sections = sects
        var listMes = {
        text: text,
        footer: footer,
        title: title,
        buttonText: butText,
        sections
        }
        jobotz.sendMessage(jid, listMes, { quoted: quoted })
        }

    /** Send Button 5 Message
     * 
     * @param {*} jid
     * @param {*} text
     * @param {*} footer
     * @param {*} button
     * @returns 
     */
        jobotz.send5ButMsg = (jid, text = '' , footer = '', but = []) =>{
        let templateButtons = but
        var templateMessage = {
        text: text,
        footer: footer,
        templateButtons: templateButtons
        }
        jobotz.sendMessage(jid, templateMessage)
        }

    /** Send Button 5 Image
     *
     * @param {*} jid
     * @param {*} text
     * @param {*} footer
     * @param {*} image
     * @param [*] button
     * @param {*} options
     * @returns
     */
    jobotz.send5ButImg = async (jid , text = '' , footer = '', img, but = [], options = {}) =>{
        let message = await prepareWAMessageMedia({ image: img }, { upload: jobotz.waUploadToServer })
        var template = generateWAMessageFromContent(jid, proto.Message.fromObject({
        templateMessage: {
        hydratedTemplate: {
        imageMessage: message.imageMessage,
               "hydratedContentText": text,
               "hydratedFooterText": footer,
               "hydratedButtons": but
            }
            }
            }), options)
            jobotz.relayMessage(jid, template.message, { messageId: template.key.id })
    }

    /** Send Button 5 Video
     *
     * @param {*} jid
     * @param {*} text
     * @param {*} footer
     * @param {*} Video
     * @param [*] button
     * @param {*} options
     * @returns
     */
    jobotz.send5ButVid = async (jid , text = '' , footer = '', vid, but = [], options = {}) =>{
        let message = await prepareWAMessageMedia({ video: vid }, { upload: jobotz.waUploadToServer })
        var template = generateWAMessageFromContent(jid, proto.Message.fromObject({
        templateMessage: {
        hydratedTemplate: {
        videoMessage: message.videoMessage,
               "hydratedContentText": text,
               "hydratedFooterText": footer,
               "hydratedButtons": but
            }
            }
            }), options)
            jobotz.relayMessage(jid, template.message, { messageId: template.key.id })
    }

    /** Send Button 5 Gif
     *
     * @param {*} jid
     * @param {*} text
     * @param {*} footer
     * @param {*} Gif
     * @param [*] button
     * @param {*} options
     * @returns
     */
    jobotz.send5ButGif = async (jid , text = '' , footer = '', gif, but = [], options = {}) =>{
        let message = await prepareWAMessageMedia({ video: gif, gifPlayback: true }, { upload: jobotz.waUploadToServer })
        var template = generateWAMessageFromContent(jid, proto.Message.fromObject({
        templateMessage: {
        hydratedTemplate: {
        videoMessage: message.videoMessage,
               "hydratedContentText": text,
               "hydratedFooterText": footer,
               "hydratedButtons": but
            }
            }
            }), options)
            jobotz.relayMessage(jid, template.message, { messageId: template.key.id })
    }

    /**
     * 
     * @param {*} jid 
     * @param {*} buttons 
     * @param {*} caption 
     * @param {*} footer 
     * @param {*} quoted 
     * @param {*} options 
     */
    jobotz.sendButtonText = (jid, buttons = [], text, footer, quoted = '', options = {}) => {
        let buttonMessage = {
            text,
            footer,
            buttons,
            headerType: 2,
            ...options
        }
        jobotz.sendMessage(jid, buttonMessage, { quoted, ...options })
    }
    
    /**
     * 
     * @param {*} jid 
     * @param {*} text 
     * @param {*} quoted 
     * @param {*} options 
     * @returns 
     */
    jobotz.sendText = (jid, text, quoted = '', options) => jobotz.sendMessage(jid, { text: text, ...options }, { quoted })

    /**
     * 
     * @param {*} jid 
     * @param {*} path 
     * @param {*} caption 
     * @param {*} quoted 
     * @param {*} options 
     * @returns 
     */
    jobotz.sendImage = async (jid, path, caption = '', quoted = '', options) => {
	let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        return await jobotz.sendMessage(jid, { image: buffer, caption: caption, ...options }, { quoted })
    }

    /**
     * 
     * @param {*} jid 
     * @param {*} path 
     * @param {*} caption 
     * @param {*} quoted 
     * @param {*} options 
     * @returns 
     */
    jobotz.sendVideo = async (jid, path, caption = '', quoted = '', gif = false, options) => {
        let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        return await jobotz.sendMessage(jid, { video: buffer, caption: caption, gifPlayback: gif, ...options }, { quoted })
    }

    /**
     * 
     * @param {*} jid 
     * @param {*} path 
     * @param {*} quoted 
     * @param {*} mime 
     * @param {*} options 
     * @returns 
     */
    jobotz.sendAudio = async (jid, path, quoted = '', ptt = false, options) => {
        let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        return await jobotz.sendMessage(jid, { audio: buffer, ptt: ptt, ...options }, { quoted })
    }

    /**
     * 
     * @param {*} jid 
     * @param {*} text 
     * @param {*} quoted 
     * @param {*} options 
     * @returns 
     */
    jobotz.sendTextWithMentions = async (jid, text, quoted, options = {}) => jobotz.sendMessage(jid, { text: text, contextInfo: { mentionedJid: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net') }, ...options }, { quoted })

    /**
     * 
     * @param {*} jid 
     * @param {*} path 
     * @param {*} quoted 
     * @param {*} options 
     * @returns 
     */
    jobotz.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        let buffer
        if (options && (options.packname || options.author)) {
            buffer = await writeExifImg(buff, options)
        } else {
            buffer = await imageToWebp(buff)
        }

        await jobotz.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
        return buffer
    }

    /**
     * 
     * @param {*} jid 
     * @param {*} path 
     * @param {*} quoted 
     * @param {*} options 
     * @returns 
     */
    jobotz.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
        let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
        let buffer
        if (options && (options.packname || options.author)) {
            buffer = await writeExifVid(buff, options)
        } else {
            buffer = await videoToWebp(buff)
        }

        await jobotz.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
        return buffer
    }
	
    /**
     * 
     * @param {*} message 
     * @param {*} filename 
     * @param {*} attachExtension 
     * @returns 
     */
    jobotz.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
        let quoted = message.msg ? message.msg : message
        let mime = (message.msg || message).mimetype || ''
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
        const stream = await downloadContentFromMessage(quoted, messageType)
        let buffer = Buffer.from([])
        for await(const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }
	let type = await FileType.fromBuffer(buffer)
        trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
        // save to file
        await fs.writeFileSync(trueFileName, buffer)
        return trueFileName
    }

    jobotz.downloadMediaMessage = async (message) => {
        let mime = (message.msg || message).mimetype || ''
        let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
        const stream = await downloadContentFromMessage(message, messageType)
        let buffer = Buffer.from([])
        for await(const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
	}
        
	return buffer
     } 
    
    /**
     * 
     * @param {*} jid 
     * @param {*} path 
     * @param {*} filename
     * @param {*} caption
     * @param {*} quoted 
     * @param {*} options 
     * @returns 
     */
    jobotz.sendMedia = async (jid, path, fileName = '', caption = '', quoted = '', options = {}) => {
        let types = await jobotz.getFile(path, true)
           let { mime, ext, res, data, filename } = types
           if (res && res.status !== 200 || file.length <= 65536) {
               try { throw { json: JSON.parse(file.toString()) } }
               catch (e) { if (e.json) throw e.json }
           }
       let type = '', mimetype = mime, pathFile = filename
       if (options.asDocument) type = 'document'
       if (options.asSticker || /webp/.test(mime)) {
        let { writeExif } = require('./lib/exif')
        let media = { mimetype: mime, data }
        pathFile = await writeExif(media, { packname: options.packname ? options.packname : global.packname, author: options.author ? options.author : global.author, categories: options.categories ? options.categories : [] })
        await fs.promises.unlink(filename)
        type = 'sticker'
        mimetype = 'image/webp'
        }
       else if (/image/.test(mime)) type = 'image'
       else if (/video/.test(mime)) type = 'video'
       else if (/audio/.test(mime)) type = 'audio'
       else type = 'document'
       await jobotz.sendMessage(jid, { [type]: { url: pathFile }, caption, mimetype, fileName, ...options }, { quoted, ...options })
       return fs.promises.unlink(pathFile)
       }

    /**
     * 
     * @param {*} jid 
     * @param {*} message 
     * @param {*} forceForward 
     * @param {*} options 
     * @returns 
     */
    jobotz.copyNForward = async (jid, message, forceForward = false, options = {}) => {
        let vtype
		if (options.readViewOnce) {
			message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : (message.message || undefined)
			vtype = Object.keys(message.message.viewOnceMessage.message)[0]
			delete(message.message && message.message.ignore ? message.message.ignore : (message.message || undefined))
			delete message.message.viewOnceMessage.message[vtype].viewOnce
			message.message = {
				...message.message.viewOnceMessage.message
			}
		}

        let mtype = Object.keys(message.message)[0]
        let content = await generateForwardMessageContent(message, forceForward)
        let ctype = Object.keys(content)[0]
		let context = {}
        if (mtype != "conversation") context = message.message[mtype].contextInfo
        content[ctype].contextInfo = {
            ...context,
            ...content[ctype].contextInfo
        }
        const waMessage = await generateWAMessageFromContent(jid, content, options ? {
            ...content[ctype],
            ...options,
            ...(options.contextInfo ? {
                contextInfo: {
                    ...content[ctype].contextInfo,
                    ...options.contextInfo
                }
            } : {})
        } : {})
        await jobotz.relayMessage(jid, waMessage.message, { messageId:  waMessage.key.id })
        return waMessage
    }

    jobotz.cMod = (jid, copy, text = '', sender = jobotz.user.id, options = {}) => {
        //let copy = message.toJSON()
		let mtype = Object.keys(copy.message)[0]
		let isEphemeral = mtype === 'ephemeralMessage'
        if (isEphemeral) {
            mtype = Object.keys(copy.message.ephemeralMessage.message)[0]
        }
        let msg = isEphemeral ? copy.message.ephemeralMessage.message : copy.message
		let content = msg[mtype]
        if (typeof content === 'string') msg[mtype] = text || content
		else if (content.caption) content.caption = text || content.caption
		else if (content.text) content.text = text || content.text
		if (typeof content !== 'string') msg[mtype] = {
			...content,
			...options
        }
        if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
		else if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
		if (copy.key.remoteJid.includes('@s.whatsapp.net')) sender = sender || copy.key.remoteJid
		else if (copy.key.remoteJid.includes('@broadcast')) sender = sender || copy.key.remoteJid
		copy.key.remoteJid = jid
		copy.key.fromMe = sender === jobotz.user.id

        return proto.WebMessageInfo.fromObject(copy)
    }


    /**
     * 
     * @param {*} path 
     * @returns 
     */
    jobotz.getFile = async (PATH, save) => {
        let res
        let data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,`[1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await getBuffer(PATH)) : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
        //if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
        let type = await FileType.fromBuffer(data) || {
            mime: 'application/octet-stream',
            ext: '.bin'
        }
        filename = path.join(__filename, '../src/' + new Date * 1 + '.' + type.ext)
        if (data && save) fs.promises.writeFile(filename, data)
        return {
            res,
            filename,
	    size: await getSizeMedia(data),
            ...type,
            data
        }

    }

    return jobotz
}

startjobotz()


let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update ${__filename}`))
	delete require.cache[file]
	require(file)
})
