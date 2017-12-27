var StartLayer = cc.Layer.extend({
    // 初始化
    ctor: function () {
        this._super();

        var size = cc.winSize;

        // 添加背景精灵
        this.bgSprite = new cc.Sprite(res.BackGround_png);
        this.bgSprite.attr({
            x: size.width / 2,
            y: size.height / 2,
        });
        // 把背景添加到场景中
        this.addChild(this.bgSprite);

        // 添加游戏名
        var gameNameLabel = new cc.LabelTTF("消灭寿司", "", 50);
        gameNameLabel.attr({
            x: size.width / 2,
            y: size.height / 2 + 150
        });
        this.addChild(gameNameLabel, 1);

        // 添加图片开始菜单项
        var startItem = new cc.MenuItemImage(
            res.Start_N_png,
            res.Start_S_png,
            function () {
                // 菜单项点击回调
                cc.log("Menu is clicked!");
                cc.director.runScene(new cc.TransitionMoveInR(1, new PlayScene(), false));
            },
            this
        );
        // 设置菜单项属性
        startItem.attr({
            x: size.width / 2,
            y: size.height / 2,
            anchorX: 0.5,
            anchorY: 0.5
        });
        // new一个菜单，把开始菜单项添加到菜单
        var menu = new cc.Menu(startItem);
        menu.x = 0;
        menu.y = 0;
        // 把菜单添加到场景中
        this.addChild(menu, 1);

        return true;
    }
});

var StartScene = cc.Scene.extend({
    onEnter: function () {
        this._super();

        var layer = new StartLayer();
        this.addChild(layer);
    }
});