﻿seajs.config({
	paths: {
		TB_ROOT: "//static.360buyimg.com/devfe/toolbar/1.0.0",
		JDF_UI: "//misc.360buyimg.com/jdf/1.0.0/ui",
		JDF_UNIT: "//misc.360buyimg.com/jdf/1.0.0/unit"
	}
}), define("toolbar", ["JDF_UNIT/trimPath/1.0.0/trimPath", "JDF_UNIT/login/3.0.0/login", "TB_ROOT/widget/common/common.css", "TB_ROOT/js/localStorageObj"], function (require, exports, module) {
	function t(t) {
		this.settings = $.extend(!0, {}, a, t),
		this.onOpen = t.onOpen || function () {},
		this.onClose = t.onClose || function () {},
		this.onSwitch = t.onSwitch || function () {},
		this.onLogin = t.onLogin || function () {},
		this.settings.links.top.href && delete this.settings.links.top.anchor,
		this.init()
	}
	var e = (require("JDF_UNIT/trimPath/1.0.0/trimPath"), require("JDF_UNIT/login/3.0.0/login")),
	i = (require("TB_ROOT/widget/common/common.css"), require("TB_ROOT/js/localStorageObj").localStorage),
	a = {
		$el: $("#J-global-toolbar"),
		pType: "",
		enabled: !0,
		bars: {
			jdvip: {
				index: .3,
				enabled: !0,
				title: "东京会员",
				login: !0,
				vip: "1",
				iframe: "//vip.jd.com/sideBar/index.html"
			},
			cart: {
				index: 1,
				enabled: !0,
				title: "购物车",
				href: "//cart.jd.com/cart.action?r=" + Math.random(),
				js: "TB_ROOT/widget/cart/cart",
				css: "TB_ROOT/widget/cart/cart.css"
			},
			follow: {
				index: 2,
				enabled: !0,
				title: "我的关注",
				login: !0,
				href: "//t.jd.com/home/follow",
				js: "TB_ROOT/widget/follow/follow",
				css: "TB_ROOT/widget/follow/follow.css"
			},
			history: {
				index: 3,
				enabled: !0,
				title: "我的足迹",
				href: "//my.jd.com/history/list.html",
				js: "TB_ROOT/widget/history/history",
				css: "TB_ROOT/widget/history/history.css"
			},
			message: {
				index: 4,
				enabled: !0,
				title: "我的消息",
				target: "//joycenter.jd.com/msgCenter/queryHistoryMessage.action"
			}
		},
		links: {
			top: {
				title: "顶部",
				anchor: "#shortcut-2013"
			}
		}
	},
	s = function (t) {
		return "mousewheel" === t.type ? t.wheelDelta > 0 ? "up" : "down" : "DOMMouseScroll" === t.type ? t.detail > 0 ? "down" : "up" : "unknown"
	},
	n = function (t) {
		return 0 === t.scrollTop() ? "top" : t.scrollTop() + t.outerHeight() >= t[0].scrollHeight ? "bottom" : "middle"
	},
	o = function (t) {
		return t[0].scrollHeight > t.innerHeight()
	};
	pageConfig.__toolbarLogin = function (t) {
		seajs.use("JDF_UNIT/login/1.0.0/login", function (e) {
			e({
				modal: !0,
				complete: function (e) {
					t(e)
				}
			})
		})
	},
	t.prototype = {
		init: function () {
			return !!this.settings.enabled && (this.$w = $(window), this.$d = $(document), this.isIE6 = $.browser.isIE6(), this.settings.clsPageType = this.getPageType(), this.render(), this.bindEvent(), this.opened = !1, this.triggerClick = "z-jdm-tbar-tab-selected", this.triggerHover = "z-jdm-tbar-tab-hover", this.toolbarOpen = "z-jdm-toolbar-open", this.$toolbar = this.settings.$el.find(".J-toolbar"), this.$wrap = this.settings.$el.find(".J-wrap"), this.$trigger = this.settings.$el.find('.J-trigger[data-type="bar"]'), this.$content = this.settings.$el.find(".J-content"), this.$newItemInCartHint = this.settings.$el.find(".jdm-tbar-tab-cart .tabs-tip"), this.setBubbleCount("cart", readCookie("cn")), this.isIE6 && (this.resetLayout("height"), this.resetLayout("top"), this.resetLayout("right")), this.settings.$el.find("#J-toolbar-load-hook").trigger("click"), this.eventDispatcher = $({}), this.settings.ad.enabled && this.insertAD(), this.bubbleKey = "toolbar_bubble", void("home" == this.settings.pType && this.setGiftBubble()))
		},
		setGiftBubble: function () {
			var t = this;
			e.isLogin(function (e) {
				e && t.setLocalStorage() && t.createGiftBubble()
			})
		},
		setLocalStorage: function () {
			var t = this;
			return i.check(t.bubbleKey)
		},
		createGiftBubble: function () {
			var t = this,
			e = t.settings.$el.find(".jdm-toolbar-tabs");
			$.ajax({
				url: "//vip.jd.com/gift/getWaitReceiveGift.html",
				scriptCharset: "utf-8",
				dataType: "jsonp",
				success: function (a) {
					var s = "",
					n = a.result.gifts;
					a.success && n.length && (s = 1 == n.length ? '<div class="poptip"><i class="giftMsg"></i><b class="giftTxt">您有一个' + n[0].name + '待领取！</b><em class="giftClose"></em><span class="poptip-arrow poptip-arrow-right"><em>◆</em><i>◆</i></span></div>' : '<div class="poptip"><i class="giftMsg"></i><b class="giftTxt">你有' + n.length + '个礼包待领取！</b><em class="giftClose"></em><span class="poptip-arrow poptip-arrow-right"><em>◆</em><i>◆</i></span></div>', e.append(s), $(".poptip .giftClose").unbind("click").bind("click", function () {
							return $(".poptip").fadeOut(300, function () {
								$(".poptip").remove(),
								i.set(t.bubbleKey)
							}),
							!1
						}), $(".poptip").unbind("click").bind("click", function () {
							$(".jdm-tbar-tab-jdvip").trigger("click"),
							$(".poptip").fadeOut(300, function () {
								$(".poptip").remove()
							})
						}))
				}
			})
		},
		getPageType: function () {
			var t = "h";
			switch (this.settings.pType) {
			case "home":
				t = "h";
				break;
			case "list":
				t = "thirdtype";
				break;
			case "search":
				t = "thirdtype";
				break;
			case "item":
				t = "shangpin";
				break;
			default:
				t = "h"
			}
			return t
		},
		render: function () {
			var t = '            <div class="jdm-toolbar-wrap J-wrap">                <div class="jdm-toolbar J-toolbar">                    <div class="jdm-toolbar-panels J-panel">                    <div data-name="ad" class="J-content jdm-toolbar-panel jdm-tbar-panel-ad">                        <h3 class="jdm-tbar-panel-header J-panel-header">                            <a>                            <i></i>                            <em class="title"></em>                            </a>                            <span class="close-panel J-close"></span>                        </h3>                        <div class="jdm-tbar-panel-main">                            <div class="jdm-tbar-panel-content J-panel-content">                            </div>                        </div>                    </div>                    {for bar in bars}                    {if bar.enabled&&!bar.target}                        <div data-name="${bar.name}" class="J-content jdm-toolbar-panel jdm-tbar-panel-${bar.name}">                            <h3 class="jdm-tbar-panel-header J-panel-header">                                <{if bar.href}a href="${bar.href}" target="_blank"{else}span{/if} class="title" clstag="${clsPageType}|keycount|cebianlan_${clsPageType}_${bar.name}|title">                                <i></i>                                <em class="title">${bar.title}</em>                                </{if bar.href}a{else}span{/if}>                                <span class="close-panel J-close"></span>                            </h3>                            <div class="jdm-tbar-panel-main">                                <div class="jdm-tbar-panel-content J-panel-content" {if bar.iframe}style="overflow:hidden;"{/if}>                                <div class="jdm-tbar-tipbox2">                                    <div class="tip-inner">                                        <i class="i-loading"></i>                                    </div>                                </div>                                </div>                            </div>                            <div class="jdm-tbar-panel-footer J-panel-footer"></div>                        </div>                    {/if}                    {/for}                    </div>                    <div class="jdm-toolbar-header">                        <div class="jdm-tbar-act J-trigger" data-type="bar" data-name="ad" data-iframe="true"                             clstag="${clsPageType}|keycount|cebianlan_${clsPageType}_header|">                        </div>                    </div>                    <div class="jdm-toolbar-tabs J-tab">                    {for bar in bars}                    {if bar.enabled}                        <div {if !bar.target} data-type="bar" {/if}                            clstag="${clsPageType}|keycount|cebianlan_${clsPageType}_${bar.name}|btn"                             class="J-trigger jdm-toolbar-tab jdm-tbar-tab-${bar.name}"                             data-name="${bar.name}"                            {if bar.login}data-login="${bar.login}"{/if}                            {if bar.iframe}data-iframe="${bar.iframe}"{/if}>                                                        {if bar.target}<a target="_blank" href="${bar.target}">{/if}                            {if bar.vip}<i class="tab-tip"></i>{/if}                                <i class="tab-ico"></i>                                <em class="tab-text">                                    ${bar.title}                                </em>                            {if bar.target}</a>{/if}                            <span class="tab-sub J-count hide">0</span>                            <div class="tabs-tip hide">                                <span class="ico"></span>                                <span class="text">成功加入购物车!</span>                                <b></b>                            </div>                        </div>                    {/if}                    {/for}                    </div>                    <div class="jdm-toolbar-footer">                    {for link in links}                        <div data-type="link" class="J-trigger jdm-toolbar-tab jdm-tbar-tab-${link.name}">                            {if link.anchor}                                <a href="${link.anchor}" clstag="${clsPageType}|keycount|cebianlan_${clsPageType}|${link.name}">                                <i class="tab-ico"></i>                                <em class="tab-text">${link.title}</em>                                </a>                            {/if}                            {if link.href}                                <a href="${link.href}" target="_blank" clstag="${clsPageType}|keycount|cebianlan_${clsPageType}|${link.name}">                                    <i class="tab-ico"></i>                                    <em class="tab-text">${link.title}</em>                                </a>                            {/if}                        </div>                    {/for}                    </div>                    <div class="jdm-toolbar-mini">                    </div>                </div>                <div id="J-toolbar-load-hook" clstag="${clsPageType}|keycount|cebianlan_${clsPageType}|load"></div>            </div>',
			e = this.sortJsonToArray(this.settings);
			e.clsPageType = this.getPageType(),
			e.ad = this.settings.ad;
			try {
				this.settings.$el.html(t.process(e))
			} catch (i) {
				console.log("Toolbar rendered error >> " + i)
			}
		},
		sortJsonToArray: function (t) {
			function e(t, e) {
				return t.index > e.index ? 1 : -1
			}
			var i = [],
			a = [];
			for (var s in t.links)
				t.links.hasOwnProperty(s) && (t.links[s].name = s, a.push(t.links[s]));
			for (var n in t.bars)
				t.bars.hasOwnProperty(n) && (t.bars[n].name = n, i.push(t.bars[n]));
			return {
				enabled: this.settings.enabled,
				ad: this.settings.ad,
				bars: i.sort(e),
				links: a,
				clsPageType: this.clsPageType
			}
		},
		setBubbleCount: function (t, e) {
			var i,
			a = this.$trigger.filter('[data-name="' + t + '"]').find(".J-count");
			e > 0 ? (i = e > 99 ? "99+" : e, a.html(i).show()) : a.hide()
		},
		updateLayout: function () {
			var t = $(window).height(),
			e = this.$content.eq(this.m.index),
			i = e.find(".J-panel-header").outerHeight(),
			a = e.find(".J-panel-footer").outerHeight(),
			s = e.find(".J-panel-content");
			s.css("height", t - i - a)
		},
		bindEvent: function () {
			var t = this;
			$(window).unbind("resize.toolbar").bind("resize.toolbar", function () {
				t.opened && t.updateLayout()
			}),
			$(document).undelegate("click.toolbar").delegate("body", "click.toolbar", function (e) {
				$.contains(t.$wrap[0], e.target) || t.close()
			}),
			this.settings.$el.delegate(".J-trigger", "mouseenter", function () {
				t.handleHover(!0, $(this)),
				$(this).hasClass("jdm-tbar-tab-jdvip") && $(".poptip").length && $(".poptip").fadeOut(300, function () {
					$(".poptip").hide()
				})
			});
			var e = null;
			this.settings.$el.delegate(".J-trigger", "mouseleave", function () {
				t.handleHover(!1, $(this)),
				$(this).hasClass("jdm-tbar-tab-jdvip") && $(".poptip").length && !t.opened && (clearTimeout(e), e = setTimeout(function () {
							$(".poptip").fadeIn(300, function () {
								$(".poptip").show()
							})
						}, 300))
			}),
			this.settings.$el.delegate(".J-trigger", "click", function () {
				$(this).hasClass("jdm-tbar-tab-jdvip") && $(".poptip").length && $(".poptip").fadeOut(300, function () {
					$(".poptip").remove()
				}),
				t.handleTrigger($(this))
			}),
			this.settings.$el.delegate(".J-close", "click", function () {
				t.close()
			}),
			this.settings.$el.delegate(".J-panel-content", "mousewheel DOMMouseScroll", function (t) {
				function e() {
					return "up" === r && "top" === l
				}
				function i() {
					return "down" === r && "bottom" === l
				}
				var a = $(this),
				r = s(t),
				l = n(a),
				d = o(a);
				(!d || e() || i()) && t.preventDefault()
			}),
			this.isIE6 && (this.$w.bind("resize", function () {
					t.resetLayout("height"),
					t.resetLayout("right")
				}), this.$w.bind("scroll", function () {
					t.resetLayout("top")
				}))
		},
		resetLayout: function (t) {
			if ("height" === t) {
				var e = this.$w.height();
				this.$toolbar.add(this.$wrap).css("height", e)
			}
			if ("top" === t) {
				var i = this.$d.scrollTop();
				this.$wrap.css("top", i)
			}
			"right" === t && (this.$w.width() % 2 > 0 ? this.$wrap.css("right", -1) : this.$wrap.css("right", 0))
		},
		handleHover: function (t, e) {
			var i = this;
			e.parent().hasClass("jdm-toolbar-header") || (t ? e.addClass(i.triggerHover) : e.removeClass(i.triggerHover))
		},
		handleTrigger: function (t) {
			var e = this,
			i = this.$trigger.index(t),
			a = "bar" === t.attr("data-type"),
			s = {
				index: i,
				login: t.attr("data-login"),
				name: t.attr("data-name"),
				iframe: t.attr("data-iframe")
			};
			return e.opened && i === e.$content.data("last") ? void e.close() : (this.m = s, !!a && void(s.login ? seajs.use("JDF_UNIT/login/1.0.0/login", function (t) {
						t.isLogin(function (i) {
							i ? e.open(s) : t({
								modal: !0,
								firstCheck: !1,
								complete: function (t) {
									e.open(s),
									e.onLogin(s)
								}
							})
						})
					}) : this.open(s)))
		},
		switchTo: function (t) {
			this.eventDispatcher.trigger(t.name + "PanelOpen"),
			this.$trigger.removeClass(this.triggerClick),
			this.$trigger.eq(t.index).parent().hasClass("jdm-toolbar-header") || this.$trigger.eq(t.index).addClass(this.triggerClick);
			var e = this.$content.data("last");
			e != t.index && (this.$content.css("visibility", "hidden"), this.$content.eq(t.index).css("z-index", "2"), this.$content.eq(t.index).css("visibility", "visible"), void 0 != e && (this.$content.eq(e).css("z-index", "1").css("visibility", "visible"), this.$content.eq(e).removeClass("toolbar-animate-in").addClass("toolbar-animate-out")), this.$content.eq(t.index).removeClass("toolbar-animate-out").addClass("toolbar-animate-in"), this.$content.data("last", t.index), this.settings.bars[t.name].loaded || this.load(t), this.updateLayout(t))
		},
		load: function (t) {
			var e = this,
			i = this.$content.eq(t.index),
			a = i.find(".J-panel-header"),
			s = i.find(".J-panel-content"),
			n = i.find(".J-panel-footer");
			if (t.iframe) {
				var o = '<iframe frameborder="0" style="height:100%;width:100%;" width="100%" height="100%" src="' + this.settings.bars[t.name].iframe + '"></iframe>';
				s.html(o),
				this.settings.bars[t.name].loaded = !0
			} else {
				var r = this.settings.bars[t.name].js,
				l = this.settings.bars[t.name].css;
				seajs.use([r, l], function (i) {
					i && new i({
						$header: a,
						$content: s,
						$footer: n
					}),
					e.settings.bars[t.name].loaded = !0
				})
			}
		},
		open: function (t) {
			this.$wrap.addClass(this.toolbarOpen),
			this.opened ? this.onSwitch(t) : this.onOpen(t),
			this.opened = !0,
			this.switchTo(t)
		},
		close: function () {
			this.$wrap.removeClass(this.toolbarOpen),
			this.$trigger.removeClass(this.triggerClick).removeClass(this.triggerHover),
			this.opened = !1,
			this.onClose()
		},
		setStatus: function (t, e, i) {
			i = i || "fd";
			var a = '            <div>                <div class="jdm-tbar-tipbox2">                    <div class="tip-inner">                        <i class="i-face-' + i + ' tip-face"></i>                        <div class="tip-text">                            {content}                        </div>                    </div>                </div>            <div>';
			t.html(a.replace("{content}", e))
		},
		newItemInCart: function () {
			var t,
			e = this.$trigger.filter('[data-name="cart"]').find(".J-count");
			t = e.is(":visible") ? parseInt(e.text(), 10) : 0,
			this.setBubbleCount("cart", t + 1),
			this.$newItemInCartHint.stop().show().css({
				opacity: 1
			}).delay(800).fadeOut(600)
		},
		sendLog: function (t, e, i) {
			log("ce_bian_lan", "0000110", this.settings.pType, t, e, i)
		}
	},
	module.exports = t
});
