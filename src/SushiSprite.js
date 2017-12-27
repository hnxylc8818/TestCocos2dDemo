var SushiSprite = cc.Sprite.extend({

    touchListener:null,     // 触摸事件
    disappearAction:null,   // 消失动画
    index:null,             // 索引
    // 进入
    onEnter: function () {
        // cc.log("onEnter");
        this._super();

        this.addTouchEventListener();
        this.disappearAction = this.createDisappearAction();
        this.disappearAction.retain();  // 对生成的消失动画增加一次引用，避免被回收
    },
    // 退出
    onExit: function () {
        // cc.log("onExit");
        this.disappearAction.release(); // 释放消失动画资源
        this._super();
    },
    // 添加触摸事件
    addTouchEventListener: function () {
        this.touchListener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            // When "swallow touches" is true, then returning 'true' from the onTouchBegan method will "swallow" the touch event, preventing other listeners from using it.
            swallowTouches: true,
            //onTouchBegan event callback function
            onTouchBegan: function (touch, event) {
                var pos = touch.getLocation();
                var target = event.getCurrentTarget();

                if (cc.rectContainsPoint(target.getBoundingBox(), pos)) {
                    cc.log("touched");
                    target.removeTouchEventListener();
                    cc.log("pos.X="+pos.x+",pos.Y="+pos.y);
                    target.stopAllActions();
                    var ac = target.disappearAction;
                    var seqAc = cc.Sequence.create(ac,cc.CallFunc.create(function () {
                        cc.log("callfun...");
                        // 添加得分
                        target.getParent().addScore();
                        // 把精灵从父类中移除
                        target.getParent().removeSushiByIndex(target.index - 1);
                        target.removeFromParent();

                    },target));
                    target.runAction(seqAc);

                    return true;
                }
                return false;
            }
        });
        cc.eventManager.addListener(this.touchListener, this);
    },
    // 移除触摸事件
    removeTouchEventListener:function () {
        cc.eventManager.removeListener(this.touchListener);
    },
    // 创建消失动画
    createDisappearAction: function () {
        var frames = [];
        for (var i = 0; i < 11; i++) {
            var name = "sushi_1n_"+i+".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(name);
            frames.push(frame);
        }

        var animation= new cc.Animation(frames,0.02);
        var action = new cc.Animate(animation);

        return action;
    }
});