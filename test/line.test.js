
"use strict";

const expect = require("chai").expect;
const sinon = require("sinon");
const path   = require("path");

const Robot       = require("hubot/src/robot");
const TextMessage = require("hubot/src/message").TextMessage;

const LineMessaging = require('index')
const SendSticker = LineMessaging.SendSticker;
const SendLocation = LineMessaging.SendLocation;
const SendImage = LineMessaging.SendImage;
const SendVideo = LineMessaging.SendVideo;
const SendText = LineMessaging.SendText;
const SendAudio = LineMessaging.SendAudio;
const StickerMessage = LineMessaging.StickerMessage;
const BuildTemplateMessage = LineMessaging.BuildTemplateMessage;

describe('Test Line Adapter', function() {
    let robot;
    let user;
    let adapter;

    before(function(done){
        // Hubot will require(hubot-adapter) in robot.coffee
        // Ensure NODE_PATH is set to root (NODE_PATH=.)
        robot = new Robot(null, 'adapter', true, 'TestHubot');
        robot.adapter.on("connected", function() {
            // console.log('adapter connected');
            user = robot.brain.userForId("1");
            adapter = robot.adapter;
            done();
        });
        robot.run();
    });

    after(function() {
        robot.shutdown();
    });

    describe('when receiving Text Message from adapter', function(){
        // Reply a Text
        describe('giving Text Respond Rule defined', function(){
            const type = 'text';
            const replyToken = 'testing token';
            const text = 'world';

            before(function(done){
                robot.respond(/hello/i, function(res){
                    res.reply('world');
                });
                done();
            });

            it("should reply a text", function(done) {
                const stub = sinon.stub(adapter, '_sendReply');
                const expected = {
                    replyToken,
                    "messages": [{
                        type,
                        text
                    }]
                }

                // Receive TextMessage
                let msg = new TextMessage(user, "@TestHubot hello");
                msg.replyToken = replyToken;

                robot.receive(msg, function() {
                    sinon.assert.calledOnce(stub);
                    sinon.assert.calledWith(stub, expected);
                    stub.restore();
                    done();
                });
            });
        });
        // Reply a Sticker
        describe('giving Sticker Respond Rule defined', function() {
            const type = 'sticker';
            const replyToken = 'testing token';
            const packageId = '1';
            const stickerId = '1';

            before(function(done){
                robot.respond(/sticker (.*)/i, function(res){
                    let keyword = res.match[1];
                    let sticker = new SendSticker(keyword, packageId);
                    res.reply(sticker);
                });
                done();
            });

            it("should reply a sticker", function(done) {
                const stub = sinon.stub(adapter, '_sendReply');
                const expected = {
                    replyToken,
                    "messages": [{
                        type,
                        packageId,
                        stickerId
                    }]
                }

                let msg = new TextMessage(user, "@TestHubot sticker 1");
                msg.replyToken = replyToken;

                robot.receive(msg, function(){
                    sinon.assert.calledOnce(stub);
                    sinon.assert.calledWith(stub, expected);
                    stub.restore();
                    done();
                });

            });
        });
        // Reply a Location
        describe('giving Location Respond Rule defined', function() {
            const type = 'location';
            const replyToken = 'testing token';
            const title = 'ＬＩＮＥ';
            const address = '〒150-0002 東京都渋谷区渋谷２丁目２１−１';
            const latitude = 35.65910807942215;
            const longitude = 139.70372892916203;

            before(function(done){
                robot.respond(/location/i, function(res){
                    let location = new SendLocation(title, address, latitude, longitude);
                    res.emote(location);
                });
                done();
            });

            it("should reply a location", function(done) {
                const stub = sinon.stub(adapter, '_sendReply');
                const expected = {
                    replyToken,
                    "messages": [{
                        type,
                        title,
                        address,
                        latitude,
                        longitude
                    }]
                }

                let msg = new TextMessage(user, "@TestHubot location");
                msg.replyToken = replyToken;

                robot.receive(msg, function(){
                    sinon.assert.calledOnce(stub);
                    sinon.assert.calledWith(stub, expected);
                    stub.restore();
                    done();
                });

            });
        });
        // Reply a Image
        describe('giving Image Respond Rule defined', function() {
            const type = 'image';
            const replyToken = 'testing token';
            const originalContentUrl = 'https://placeholdit.imgix.net/~text?txtsize=34&txt=360%C3%97360&w=360&h=360';
            const previewImageUrl = 'https://placeholdit.imgix.net/~text?txtsize=23&txt=240%C3%97240&w=240&h=240';

            before(function(done){
                robot.respond(/image/i, function(res){
                    res.reply(new SendImage(originalContentUrl, previewImageUrl));
                });
                done();
            });

            it("should reply a image", function(done) {
                const stub = sinon.stub(adapter, '_sendReply');
                const expected = {
                    replyToken,
                    "messages": [{
                        type,
                        originalContentUrl,
                        previewImageUrl,
                    }]
                }

                let msg = new TextMessage(user, "@TestHubot image");
                msg.replyToken = replyToken;

                robot.receive(msg, function(){
                    sinon.assert.calledOnce(stub);
                    sinon.assert.calledWith(stub, expected);
                    stub.restore();
                    done();
                });

            });
        });
        // Reply a Video
        describe('giving Video Respond Rule defined', function() {
            const type = 'video';
            const replyToken = 'testing token';
            const originalContentUrl = 'https://example.com/original.mp4';
            const previewImageUrl = 'https://example.com/preview.jpg';

            before(function(done){
                robot.respond(/video/i, function(res){
                    res.reply(new SendVideo(originalContentUrl, previewImageUrl));
                });
                done();
            });

            it("should reply a video", function(done) {
                const stub = sinon.stub(adapter, '_sendReply');
                const expected = {
                    replyToken,
                    "messages": [{
                        type,
                        originalContentUrl,
                        previewImageUrl,
                    }]
                }

                let msg = new TextMessage(user, "@TestHubot video");
                msg.replyToken = replyToken;

                robot.receive(msg, function(){
                    sinon.assert.calledOnce(stub);
                    sinon.assert.calledWith(stub, expected);
                    stub.restore();
                    done();
                });

            });
        });
        // Reply a Audio
        describe('giving Audio Respond Rule defined', function() {
            const type = 'audio';
            const replyToken = 'testing token';
            const originalContentUrl = 'https://example.com/original.m4a';
            const duration = 240000;

            before(function(done){
                robot.respond(/audio/i, function(res){
                    res.reply(new SendAudio(originalContentUrl, duration));
                });
                done();
            });

            it("should reply a audio", function(done) {
                const stub = sinon.stub(adapter, '_sendReply');
                const expected = {
                    replyToken,
                    "messages": [{
                        type,
                        originalContentUrl,
                        duration,
                    }]
                }

                let msg = new TextMessage(user, "@TestHubot audio");
                msg.replyToken = replyToken;

                robot.receive(msg, function(){
                    sinon.assert.calledOnce(stub);
                    sinon.assert.calledWith(stub, expected);
                    stub.restore();
                    done();
                });

            });
        });
        // Reply a TemplateMsg
        describe('giving Template Respond Rule defined', ()=>{
            const replyToken = 'testing token';
            let tmsg;

            before(function(done){
                robot.respond(/template/i, function(res){
                    tmsg = BuildTemplateMessage
                    .init('this is a buttons template')
                    .buttons({
                        "thumbnailImageUrl": "https://example.com/bot/images/image.jpg",
                        "title": "Menu",
                        "text": "Please select"
                    })
                    .action('postback', {
                        "label": "Buy",
                        "data": "action=buy&itemid=123"
                    })
                    .action('postback', {
                        "label": "Add to cart",
                        "data": "action=add&itemid=123"
                    })
                    .action('uri', {
                        "label": "View detail",
                        "uri": "http://example.com/page/123"
                    })
                    .build();
                    res.reply(tmsg);
                });
                done();
            });

            it('should reply a template message', (done)=>{
                const stub = sinon.stub(adapter, '_sendReply');
                const expectedMsg = {
                    "type": "template",
                    "altText": "this is a buttons template",
                    "template": {
                        "type": "buttons",
                        "thumbnailImageUrl": "https://example.com/bot/images/image.jpg",
                        "title": "Menu",
                        "text": "Please select",
                        "actions": [
                          {
                            "type": "postback",
                            "label": "Buy",
                            "data": "action=buy&itemid=123"
                          },
                          {
                            "type": "postback",
                            "label": "Add to cart",
                            "data": "action=add&itemid=123"
                          },
                          {
                            "type": "uri",
                            "label": "View detail",
                            "uri": "http://example.com/page/123"
                          }
                        ]
                    }
                }
                const expected = {
                    replyToken,
                    "messages": [
                        expectedMsg
                    ]
                }

                let msg = new TextMessage(user, "@TestHubot template");
                msg.replyToken = replyToken;

                robot.receive(msg, function(){
                    sinon.assert.calledOnce(stub);
                    sinon.assert.calledWith(stub, expected);
                    stub.restore();
                    done();
                });
            })
        })
    });



    describe('when receiving Sticker Message from adapter', function(){
        before(function(done){
            const matcher = function(message){
                // Not implement listenrt, so should CatchAllMessage.message
                if (message.message instanceof StickerMessage){
                    // console.log('INTO MATCHER');
                    return true
                }
                return false;
            }
            robot.listen(matcher, function(res){
                const stickerMessage = res.message.message;
                res.envelope.message = stickerMessage;
                const sticker = new SendSticker(stickerMessage.stickerId, stickerMessage.packageId);
                res.reply(sticker);
            });
            done();
        });

        describe('giving Sticker Respond Rule defined', function(){
            it('should reply a sticker', function(done){
                let stub = sinon.stub(adapter, '_sendReply');
                const expected = {
                    "replyToken": "testing token",
                    "messages": [{
                        "type": "sticker",
                        "packageId": "1",
                        "stickerId": "1"
                    }]
                }

                const msg = new StickerMessage(user, "1", "1", "mid", "testing token");

                robot.receive(msg, function(){
                    sinon.assert.calledOnce(stub);
                    sinon.assert.calledWith(stub, expected);
                    stub.restore();
                    done();
                });
            });
        })
    });

    describe('when hear a Webhook request from Line', function() {
        let httpRequest;
        let autoPassValidate;
        let input;

        before(function(done){
            autoPassValidate = sinon.stub(adapter.streaming, 'validateSignature').returns(true);

            httpRequest = robot.http('http://localhost:8080')
                .header('Content-Type', 'application/json')
                .header('x-line-signature', "test");
            input = {
              "events": [
                  {
                    "replyToken": "nHuyWiB7yP5Zw52FIkcQobQuGDXCTA",
                    "type": "message",
                    "timestamp": 1462629479859,
                    "source": {
                         "type": "user",
                         "userId": "U206d25c2ea6bd87c17655609a1c37cb8"
                     },
                     "message": {/*  override me */}
                  }
              ]
            };
            done();
        });

        after(function(){
            autoPassValidate.restore();
        });

        //
        describe('with wrong x-line-signature', ()=>{
            let json;
            before((done)=>{
                autoPassValidate.returns(false);
                json = JSON.stringify(input);
                done();
            });
            it('should return statusCode 403', (done)=>{
                const stub = sinon.stub(robot.logger, 'error');
                httpRequest.post(json)((err, res, body)=>{
                    expect(res.statusCode).to.equal(403);
                    stub.restore();
                    done();
                });
            });
            after((done)=>{
                autoPassValidate.returns(true);
                done();
            })
        });

        describe('with text message content', function() {
            let json;
            const message = {
                "id": "325708",
                "type": "text",
                "text": "Hello, world"
            };

            before(function(done){
                // Because this test is only for testing LineStreaming.
                // In oreder to avoid trigger the real flow, don't send text like "@Testhubot hello"
                input.events[0].message = message;
                json = JSON.stringify(input);
                done();
            });

            it("should emit a text event to customize scripts", function(done) {
                const spy = sinon.spy();
                const expected = {
                    "sourceId": "U206d25c2ea6bd87c17655609a1c37cb8",
                    "replyToken": "nHuyWiB7yP5Zw52FIkcQobQuGDXCTA",
                    "message": message
                }

                adapter.streaming.once('text', spy);
                // Fire http
                httpRequest.post(json)((err, res, body)=>{
                    expect(res.statusCode).to.equal(200);
                    sinon.assert.calledOnce(spy);
                    sinon.assert.calledWith(spy, expected.sourceId, expected.replyToken, expected.message);
                    done();
                });

            });
        });

        describe('with sticker message content', function() {
            let json;
            const message = {
                "id": "325708",
                "type": "sticker",
                "packageId": "1",
                "stickerId": "1"
            };

            before(function(done){
                input.events[0].message = message;
                json = JSON.stringify(input);
                done();
            });

            it("should emit a sticker event to customize scripts", function(done) {
                const spy = sinon.spy();
                const expected = {
                    "sourceId": "U206d25c2ea6bd87c17655609a1c37cb8",
                    "replyToken": "nHuyWiB7yP5Zw52FIkcQobQuGDXCTA",
                    "message": message
                }

                adapter.streaming.once('sticker', spy);
                // Fire http
                httpRequest.post(json)(function(err, res, body){
                    expect(res.statusCode).to.equal(200);
                    sinon.assert.calledOnce(spy);
                    sinon.assert.calledWith(spy, expected.sourceId, expected.replyToken, expected.message);
                    done();
                });

            });
        });

        describe('with image message content', function() {
            let json;
            const message = {
                "id": "325708",
                "type": "image"
            };

            before(function(done){
                input.events[0].message = message;
                json = JSON.stringify(input);
                done();
            });

            it("should emit a image event to customize scripts", function(done) {
                const spy = sinon.spy();
                const expected = {
                    "sourceId": "U206d25c2ea6bd87c17655609a1c37cb8",
                    "replyToken": "nHuyWiB7yP5Zw52FIkcQobQuGDXCTA",
                    "message": message
                }

                adapter.streaming.once('image', spy);
                // Fire http
                httpRequest.post(json)(function(err, res, body){
                    expect(res.statusCode).to.equal(200);
                    sinon.assert.calledOnce(spy);
                    sinon.assert.calledWith(spy, expected.sourceId, expected.replyToken, expected.message);
                    done();
                });

            });
        });

        describe('with video message content', function() {
            let json;
            const message = {
                "id": "325708",
                "type": "video"
            };

            before(function(done){
                input.events[0].message = message;
                json = JSON.stringify(input);
                done();
            });

            it("should emit a video event to customize scripts", function(done) {
                const spy = sinon.spy();
                const expected = {
                    "sourceId": "U206d25c2ea6bd87c17655609a1c37cb8",
                    "replyToken": "nHuyWiB7yP5Zw52FIkcQobQuGDXCTA",
                    "message": message
                }

                adapter.streaming.once('video', spy);
                // Fire http
                httpRequest.post(json)(function(err, res, body){
                    expect(res.statusCode).to.equal(200);
                    sinon.assert.calledOnce(spy);
                    sinon.assert.calledWith(spy, expected.sourceId, expected.replyToken, expected.message);
                    done();
                });

            });
        });

        describe('with audio message content', function() {
            let json;
            const message = {
                "id": "325708",
                "type": "audio"
            };

            before(function(done){
                input.events[0].message = message;
                json = JSON.stringify(input);
                done();
            });

            it("should emit a audio event to customize scripts", function(done) {
                const spy = sinon.spy();
                const expected = {
                    "sourceId": "U206d25c2ea6bd87c17655609a1c37cb8",
                    "replyToken": "nHuyWiB7yP5Zw52FIkcQobQuGDXCTA",
                    "message": message
                }

                adapter.streaming.once('audio', spy);
                // Fire http
                httpRequest.post(json)(function(err, res, body){
                    expect(res.statusCode).to.equal(200);
                    sinon.assert.calledOnce(spy);
                    sinon.assert.calledWith(spy, expected.sourceId, expected.replyToken, expected.message);
                    done();
                });

            });
        });

        describe('with location message content', function() {
            let json;
            const message = {
                "id": "325708",
                "type": "location",
                "title": "my location",
                "address": "〒150-0002 東京都渋谷区渋谷２丁目２１−１",
                "latitude": 35.65910807942215,
                "longitude": 139.70372892916203
            };

            before(function(done){
                input.events[0].message = message;
                json = JSON.stringify(input);
                done();
            });

            it("should emit a location event to customize scripts", function(done) {
                const spy = sinon.spy();
                const expected = {
                    "sourceId": "U206d25c2ea6bd87c17655609a1c37cb8",
                    "replyToken": "nHuyWiB7yP5Zw52FIkcQobQuGDXCTA",
                    "message": message
                }

                adapter.streaming.once('location', spy);
                // Fire http
                httpRequest.post(json)(function(err, res, body){
                    expect(res.statusCode).to.equal(200);
                    sinon.assert.calledOnce(spy);
                    sinon.assert.calledWith(spy, expected.sourceId, expected.replyToken, expected.message);
                    done();
                });

            });
        });

    });
})
