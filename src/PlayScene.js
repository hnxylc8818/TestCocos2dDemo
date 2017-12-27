var PlayLayer = cc.Layer.extend({
    bgSprite: null,
    SushiSprites: null,
    score: 0,
    scoreLabel: null,
    timeout: 10,
    timeoutLabel: null,
    // 初始化
    ctor: function () {
        this._super();
        this.SushiSprites = [];
        var size = cc.winSize;

        cc.spriteFrameCache.addSpriteFrames(res.Sushi_plist);

        // add bg
        this.bgSprite = new cc.Sprite(res.BackGround_png);
        this.bgSprite.attr({
            x: size.width / 2,
            y: size.height / 2,
            rotation: 180
        });

        this.addChild(this.bgSprite, 0);

        // 添加得分Label
        this.scoreLabel = new cc.LabelTTF("分数:0", "Arial", 20);
        this.scoreLabel.attr({
            x: size.width - 60,
            y: size.height - 20
        });
        this.addChild(this.scoreLabel, 5);
        // 添加倒计时Label
        this.timeoutLabel = new cc.LabelTTF("" + this.timeout, "Arial", 30);
        this.timeoutLabel.x = 25;
        this.timeoutLabel.y = size.height - 20;
        this.addChild(this.timeoutLabel, 5);

        // 精灵刷新定时器
        this.schedule(this.update, 1, 16 * 1024, 1);
        // 倒计时定时器
        this.schedule(this.timer, 1, this.timeout, 1);

        return true;
    },
    // 添加得分
    addScore: function () {
        this.score += 1;
        this.scoreLabel.setString("分数:" + this.score);
    },
    // 添加掉落的精灵
    addSushi: function () {

        var sushi = new SushiSprite("#sushi_1n.png");
        var size = cc.winSize;

        var x = sushi.width / 2 + size.width / 2 * cc.random0To1();
        sushi.attr({
            x: x,
            y: size.height - 30
        });

        this.SushiSprites.push(sushi);
        sushi.index = this.SushiSprites.length;

        this.addChild(sushi, 5);

        var dropAction = cc.MoveTo.create(4, cc.p(sushi.x, -30));
        sushi.runAction(dropAction);
    },
    // 更新场景中的精灵，增加新的精灵，移除屏幕底部的精灵
    update: function () {
        this.addSushi();
        this.removeSushi();
    },
    // 移除屏幕底部的精灵
    removeSushi: function () {
        for (var i = 0; i < this.SushiSprites.length; i++) {
            cc.log("removeSushi...");
            // cc.log("------>removeSushiY:" + this.SushiSprites[i].y);
            if (0 >= this.SushiSprites[i].y) {
                cc.log("------>remove:" + i);
                // cc.log("------>removeY:" + this.SushiSprites[i].y);
                this.SushiSprites[i].removeFromParent();
                this.SushiSprites[i] = undefined;
                this.SushiSprites.splice(i, 1);
                i = i - 1;
            }
        }
    },
    // 移除所有的精灵
    removeAllSushi:function () {
        for (var i = 0; i < this.SushiSprites.length; i++) {
            cc.log("removeAllSushi...");
            this.SushiSprites[i].removeFromParent();
            this.SushiSprites[i] = undefined;
            this.SushiSprites.splice(i, 1);
            i = i - 1;
        }
    },
    // 把指定索引的精灵从SushiSprites数组中移除
    removeSushiByIndex: function (index) {
        if (isNaN(index) || index > this.SushiSprites.length) {
            return false;
        }
        for (var i = 0, n = 0; i < this.length; i++) {
            if (this.SushiSprites[i] !== this[index]) {
                cc.log("--------------");
                this.SushiSprites[n++] = this.SushiSprites[i]
            }
        }
        this.SushiSprites.length -= 1;
    },
    // 60s倒计时，为0时显示游戏结束Layer
    timer: function () {
        if (this.timeout === 0) {
            // 游戏结束Layer
            var gameOver = new cc.LayerColor(cc.color(225, 225, 225, 100));
            var size = cc.winSize;
            gameOver.size = size;
            // 标题
            var titleLabel = new cc.LabelTTF("游戏结束", "Arial", 40);
            titleLabel.attr({
                x: size.width / 2,
                y: size.height / 2
            });
            // 添加标题到Layer
            gameOver.addChild(titleLabel, 5);
            // 重试文字菜单项
            var tryAgainItem = new cc.MenuItemFont(
                "再来一次",
                function () {
                    // 点击Try Again Item回调
                    var transition = new cc.TransitionFade(1, new PlayScene(), cc.color(255, 255, 255, 255));
                    cc.director.runScene(transition);
                },
                this
            );
            tryAgainItem.attr({
                x: size.width / 2,
                y: size.height / 2 - 60,
                anchorX: 0.5,
                anchorY: 0.5
            });
            var backItem = new cc.MenuItemFont(
                "返回",
                function () {
                    // 点击Try Again Item回调
                    var transition = new cc.TransitionMoveInL(1, new StartScene(),false);
                    cc.director.runScene(transition);
                },
                this
            );
            backItem.attr({
                x: size.width / 2,
                y: size.height / 2 - 120,
                anchorX: 0.5,
                anchorY: 0.5
            });
            // new一个菜单，添加TryAgain菜单项到菜单
            var menu = new cc.Menu();
            menu.addChild(tryAgainItem);
            menu.addChild(backItem);
            menu.x = 0;
            menu.y = 0;
            // 添加菜单到Layer
            gameOver.addChild(menu, 1);
            // 添加Layer到PlayScene场景中
            this.getParent().addChild(gameOver);
            // 结束定时器
            this.unschedule(this.update);
            this.unschedule(this.timer);
            // 移除所有精灵
            this.removeAllSushi();
            return;
        }
        // 倒计时时间
        this.timeout -= 1;
        this.timeoutLabel.setString("" + this.timeout);
    }
});

var PlayScene = cc.Scene.extend({
    onEnter: function () {
        this._super();

        var layer = new PlayLayer();
        this.addChild(layer);
    }
});