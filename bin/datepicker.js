(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
window.DatePicker = require('./index.js');
},{"./index.js":2}],2:[function(require,module,exports){
module.exports = require('./lib/datepicker').DatePicker;

},{"./lib/datepicker":4}],3:[function(require,module,exports){
/**
 * @author: zimyuan
 * @last-edit-date: 2016-02-13
 */

/**
 * @constructor
 * @desc: 封装常用Date处理函数
 */ 
function DateParse() {

}

DateParse.prototype = {
	/**
	 * @desc: 获取一个月的天数
	 * @param  {Number} year  : 四位数的年份
	 * @param  {Number} month : 从1开始计算月份
	 * @return {Number}       : 所求月份的天数
	 */
	getDaysInMonth: function(year, month) {
		return new Date(year, month, 0).getDate();
	},

	/**
	 * @desc: 获取一个月的第一天是星期几
	 * @param  {Number} year  : 四位数的年份
	 * @param  {Number} month : 从1开始计算月份
	 * @return {Number}       : 0-6，分别代表星期日到星期六
	 */
	getFirstdayWeek: function(year, month) {
		return new Date(year, month - 1, 1).getDay();
	},
        
        /**
	 * @desc: 获取一个月的第一天
	 * @param  {Number} year  : 四位数的年份
	 * @param  {Number} month : 从1开始计算月份
	 * @return {Date}         : 所求月份最后一天的日期对象 
	 */
	getFirstDayInMonth: function(year, month) {
		return new Date(year, month - 1, 1);
	},

	/**
	 * @desc: 获取一个月的最后一天
	 * @param  {Number} year  : 四位数的年份
	 * @param  {Number} month : 从1开始计算月份
	 * @return {Date}         : 所求月份最后一天的日期对象 
	 */
	getLastDayInMonth: function(year, month) {
		return new Date(year, month - 1, this.getDaysInMonth(year, month));
	},	

	/**
	 * @desc: 获取某一个月上个月的`年`和`月`
	 * @param  {Number} year  : 四位数的年份
	 * @param  {Number} month : 从1开始计算月份
	 * @return {Object}       : 包含上个月`年`和`月`信息的对象  
	 */
	getLastMonth: function(year, month) {
		var lastMonth = (  month  === 1
					 ? 12
					 : month - 1  ),
			lastYear  = (  month === 1
					 ? year - 1
					 : year  );
		
		return {
			year  : lastYear,
			month : lastMonth 
		};
	},

	/**
	 * @desc: 获取某一个月下个月的`年`和`月`
	 * @param  {Number} year  : 四位数的年份
	 * @param  {Number} month : 从1开始计算月份
	 * @return {Object}       : 包含下个月`年`和`月`信息的对象  
	 */	
	 getNextMonth: function(year, month) {
		var nextMonth = (  month === 12
						 ? 1
						 : month + 1  );
			nextYear = (  month  === 12
						? year + 1
						: year  );

		return {
			year  : nextYear,
			month : nextMonth
		};
	},

	/**
	 * @desc: 封装`一个月`中上个月的几天
	 * @param  {Number} year  : 当月的年份
	 * @param  {Number} month : 从1开始计算的当月月份
	 * @return {Array}  list  : 上个月数据数组
	 */	
	_packLastMonthDays: function(year, month, week) {
		var temp       = null,
			list       = [],
			lastMonth  = this.getLastMonth(year, month),
			ldays      = this.getDaysInMonth(lastMonth.year, lastMonth.month);
			startIndex = (  week === 0
						  ? 6
						  : week - 1  );

		for ( var i = startIndex; i >= 0;i-- ) {
			temp = {
				num  : ldays - i,
				gray : 1,
                                disabled : 1
			};

			list.push(temp);
		}

		return list;
	},

	/**
	 * @desc: 封装`一个月`中上个月的几天
	 * @param  {Number} week  : 本月最后一天的星期
	 * @return {Array}  list  : 下个月数据数组
	 */	
	_packNextMonthDays: function(week, appendNum) {
		var list      = [],
			temp 	  = null,
			appendNum = appendNum || 0,
			endIndex  = (  week < 6
						 ? ( 6 - week )
						 : ( 6 - week ) + 7  );

		// 打包下个月数据头几天数据
		for ( var i = 1;i <= endIndex + appendNum;i++ ) {
			temp = {
				num  : i,
				gray : 1 ,
                                disabled : 1
			};
			list.push(temp);
		}

		return list;
	},

	/**
	 * @desc: 封装当月天数
	 * @param  {Number} days  : 当月的总天数
	 * @param  {Number} curr  : 当前日期
	 * @return {Array}  list  : 当月数据数组
	 */	
	_packCurrMonthDays: function(days, curr) {
		var list = [],
			temp = null;

		// 打包本月数据
		for ( var i = 1;i <= days;i++ ) {
			temp = {
				num  : i,
				gray : 0 ,
                                disabled: 0
			};

			temp.active = (  i === curr
						   ? 1
						   : 0  );

			list.push(temp);
		}

		return list;
	},

	/**
	 * @desc: 获取给定`年月日`的对应月份数据
	 * @param  {Number} year  : 四位数的年份
	 * @param  {Number} month : 从1开始的月份 
	 * @param  {Number} day   : 从1开始的日期
	 * @return {Array}  list  : 对应月份数据数组
	 */	
	getOneMonth: function(year, month, day) {
		// 本月数据
		var days  = this.getDaysInMonth(year, month),
			week  = this.getFirstdayWeek(year, month),
			last  = this.getLastDayInMonth(year, month).getDay();

		var list = [];

		var lastMonth = this._packLastMonthDays(year, month, week),
			currMonth = this._packCurrMonthDays(days, day),
			appendNum = (  lastMonth.length + currMonth.length < 35
						 ? 7
						 : 0  ),
			nexMonth  = this._packNextMonthDays(last, appendNum); 

		list = list.concat(lastMonth, currMonth, nexMonth);

		return list;
	}
};

module.exports = DateParse;

},{}],4:[function(require,module,exports){
/**
 * @author: zimyuan
 * @last-edit-date: 2015-03-03
 */

var tpl  	  = require('./datepicker_tpl'),
	util 	  = require('./util'),
	DateParse = require('./dateparse');

// 组件默认配置
var _defaultConfig = {
	minDate    : null,//Date 请注意 为避免混乱 需要指定时区
	maxDate    : null,//Date 请注意 为避免混乱 需要指定时区 如 new Date('2016-01-01')
	currDate   : new Date(),
	panelShow  : 'datepicker_show',
	grayCls    : 'datepicker__day-item_gray',
	activeCls  : 'datepicker__day-item_active',
	confirmCbk : null,
        
        //自定义日期显示 通过扩展这个方法获取一个月所有日期的html 参数和返回值见 _genOneMonthStr
        genDaysOfMonthHtml : null
};

function DatePicker(options) {
    this.config = $.extend(_defaultConfig, options || {});

    this._init();
}


// 类的继承
util.inheritPrototype(DatePicker, DateParse);

var prototype = {
	_init: function() {
		this._appendPanel();
		this._initDom();
		this._initEvents();
                
                this._checkPrevDisabled(this.data.year, this.data.month);
                this._checkNextDisabled(this.data.year, this.data.month);
	},

	_initEvents: function() {
		var that   = this;
			aniEvt = util.whichTransitionEvent();

		this.$cancel.on('click', this.close.bind(this))
		this.$mask.on('click',   this.close.bind(this));
		this.$mPrev.on('click',  this._clickPrevMonth.bind(this));
		this.$mNext.on('click',  this._clickNextMonth.bind(this));
		this.$yPrev.on('click',  this._clickPrevYear.bind(this));
		this.$yNext.on('click',  this._clickNextYear.bind(this));
		this.$confirm.on('click', this._onClickConfirm.bind(this));

		this.$panel.on('click', '.datepicker__day-item', function(e) {
			that._onClickDayBtn.call(that, this);
		});

		this.$panel.on(aniEvt, '.datepicker__day-list_prev', function() {
			$(this).remove();	
		});

		this.$panel.on(aniEvt, '.datepicker__day-list_next', function() {
			$(this).remove();	
		});

		this.$panel.on(aniEvt, '.datepicker__mask', function() {
			if ( !that.$picker.hasClass(that.config.panelShow) )
				that.$picker.addClass('ui-d-n');
		});
	},

	_initDom: function() {
		this.$picker  = $('.datepicker'); 
		this.$mask    = this.$panel.find('.datepicker__mask');
		this.$dayList = this.$panel.find('.datepicker__day-wrap'); 
		this.$yPrev   = this.$panel.find('#_j_year_prev');
		this.$yNext	  = this.$panel.find('#_j_year_next');
		this.$mPrev   = this.$panel.find('#_j_month_prev'); 
		this.$mNext   = this.$panel.find('#_j_month_next');
		this.$year    = this.$panel.find('#_j_year_text');
		this.$month   = this.$panel.find('#_j_month_text');
		this.$cancel  = this.$panel.find('#_j_cancel_btn');
		this.$confirm = this.$panel.find('#_j_confirm_btn');
	},
	
	_appendPanel: function() {
		var that 	 = this,
			currDate = this.config.currDate,
			year     = currDate.getFullYear(),
			month    = currDate.getMonth() + 1,
			day   	 = currDate.getDate(),
			dayList  = that.getOneMonth(year, month, day),
			rdata    = {
				year     : year,
				month    : month,
				all_days : that._genOneMonthStr(dayList, year, month).join('')
			};

		this.$panel = $(util.format(tpl, rdata));
		$("body").append(this.$panel);

		// 保存当前信息
		this._saveCurrentData(year, month, currDate.getDate());
	},

        /**
         * 生成日期列表html
         * @param {Array} dayList [num:1,gray:0]
         * @param {int} year
         * @param {int} month
         * @returns {Array} 多个html组成的数组 每个元素为一个日期的html
         */
	_genOneMonthStr: function(dayList, year, month) {
		var htmlArr = [],
			base    = 'datepicker__day-item ',
			gray    = 'datepicker__day-item_gray',
			active  = 'datepicker__day-item_active',
			_class   = '',
			temp    = '';
                var listLength = dayList.length;
                var tpls = [];
                if(this.config.genDaysOfMonthHtml) {
                    tpls = this.config.genDaysOfMonthHtml(dayList, year, month, this);
                }
		for ( var i = 0, il = listLength; i < il;i++ ) {
                    var disabled = dayList[i].disabled || (tpls[i]&&tpls[i].disabled) || this._dateDisabled(year, month, dayList[i].num);
			_class = (   disabled
					 ? base + gray
					 : base  );
			_class = ( dayList[i].active && !disabled
				      ? _class + active
				      : _class  );
			temp = '<li class="' + _class + '">' + (tpls[i] && tpls[i].tpl ? tpls[i].tpl : dayList[i].num )+ '</li>';
			htmlArr.push(temp);
		}

		return htmlArr;
	},

	_appendMonth: function(year, month, day, isprev) {
		var dayList  = this.getOneMonth(year, month, day),
			all_days = this._genOneMonthStr(dayList, year, month).join('');
			_class   = (  isprev
						? 'datepicker__day-list datepicker__day-list_prev'
						: 'datepicker__day-list datepicker__day-list_next'  ),
			$newMonth = $('<ul class="' + _class + '">' + all_days + '</ul>');

		this.$dayList.append($newMonth);
	},

	_toggleMonth: function(newYear, newMonth, newDay, isprev) {
		this._appendMonth(newYear, newMonth, newDay, isprev);

		this._saveCurrentData(newYear, newMonth, newDay);
		this._syncDataToDom();

		var _curr   = 'datepicker__day-list-curr', 
			_class1 = ( isprev
					   ? 'datepicker__day-list_prev'
					   : 'datepicker__day-list_next' ),
			_class2 = ( isprev
					   ? 'datepicker__day-list_next'
					   : 'datepicker__day-list_prev'  );		

		var $curr = $('.' + _curr);
                
                this._checkPrevDisabled(newYear, newMonth);
                this._checkNextDisabled(newYear, newMonth);
                
		setTimeout(function() {
			$('.' + _class1).removeClass(_class1).addClass(_curr);
			$curr.addClass(_class2).removeClass(_curr);
		}, 0);
	},

	_saveCurrentData: function(year, month, day) {
		this.data = {
			year  : year,
			month : month,
			day   : day
		};
	},

	_getCurrentData: function() {
		return this.data;
	},

	_syncDataToDom: function() {
		var curr  = this._getCurrentData(),
			month = (  curr.month === 0
					 ? 12
					 : curr.month  ),
			year  = (  curr.month === 0
					 ? curr.year -1
					 : curr.year  );

		this.$year.text(year + '年');
		this.$month.text(month + '月');
                
                
	},
        _dateDisabled:function(year, month, day) {
            if(this.config.minDate ) {
                if(new Date(year, month-1, day).getTime()<this.config.minDate.getTime()) {
                    return true;
                }
            }
            if(this.config.maxDate ) {
                if(new Date(year,month-1,day).getTime()>this.config.maxDate.getTime()) {
                    return true;
                }
            }
            return false;
        },
        //检查前一月/年 是否可用 month为从1开始计的月份
	_checkPrevDisabled:function(year, month) {
            if(this.config.minDate) {
                if(this.getLastDayInMonth(year-1, 12).getTime()<this.config.minDate.getTime()) {
                    this.$yPrev.addClass('disabled');
                } else {
                    this.$yPrev.removeClass('disabled');
                }
                if(this.getLastDayInMonth(month===1?year-1:year, month===1?12:month-1).getTime()<this.config.minDate.getTime()) {
                    this.$mPrev.addClass('disabled');
                } else {
                    this.$mPrev.removeClass('disabled');
                }
            }
        },
        //检查后一月/年是否可用
        _checkNextDisabled:function(year, month) {
            if(this.config.maxDate) {
                if(this.getFirstDayInMonth(year+1, 1).getTime()>this.config.maxDate.getTime()) {
                    this.$yNext.addClass('disabled');
                } else {
                    this.$yNext.removeClass('disabled');
                }
                if(this.getFirstDayInMonth(month===12?year+1:year, month===12?1:month+1).getTime()>this.config.maxDate.getTime()) {
                    this.$mNext.addClass('disabled');
                } else {
                    this.$mNext.removeClass('disabled');
                }
            }
        },
	_clickPrevMonth: function() {
            if(this.$mPrev.hasClass('disabled')) {
                return false;
            }
		var curr 	  = this._getCurrentData();
			last 	  = this.getLastMonth(curr.year, curr.month),
			prevYear  = last.year,
			prevMonth = last.month;

		this._toggleMonth(prevYear, prevMonth, curr.day, 1);
	},

	_clickNextMonth: function() {
            if(this.$mNext.hasClass('disabled')) {
                return false;
            }
		var curr 	  = this._getCurrentData();
			next 	  = this.getNextMonth(curr.year, curr.month),
			nextYear  = next.year,
			nextMonth = next.month;
		this._toggleMonth(nextYear, nextMonth, curr.day, 0);
	},

	_clickPrevYear: function() {
            if(this.$yPrev.hasClass('disabled')) {
                return false;
            }
		var curr 	  = this._getCurrentData();
                
		this._toggleMonth(curr.year - 1, curr.month, curr.day, 1);
	},

	_clickNextYear: function() {
            if(this.$yNext.hasClass('disabled')) {
                return false;
            }
		var curr 	  = this._getCurrentData();

		this._toggleMonth(curr.year + 1, curr.month, curr.day, 0);		
	},

	_onClickDayBtn: function(btn) {
		var grayCls   = this.config.grayCls,
			activeCls = this.config.activeCls,
			curr 	  = this._getCurrentData(), 
			$day      = $(btn);

		if ( $day.hasClass(grayCls) || $day.hasClass(activeCls) )
			return;

		$('.datepicker__day-item').removeClass(activeCls);
		$day.addClass(activeCls);

		this._saveCurrentData(curr.year, curr.month, parseInt($day.text()));
	},

	_onClickConfirm: function() {
		var curr = this._getCurrentData();

		this.close();
		this.config.confirmCbk && this.config.confirmCbk(curr); 
	},

	open: function(el) {
		var that = this;

		that.$el = (  el
					? el
					: null  );		

		that.$picker.removeClass('ui-d-n');
		setTimeout(function() {
			that.$panel.addClass(that.config.panelShow);
		}, 30);
	},

	close: function() {
		var that = this;

		that.$panel.removeClass(that.config.panelShow);	
		setTimeout(function() {
			that.$picker.addClass('ui-d-n');
		}, 310);
	}
};

util.extend(prototype, DatePicker.prototype);
module.exports = {
	DatePicker: DatePicker
};

},{"./dateparse":3,"./datepicker_tpl":5,"./util":6}],5:[function(require,module,exports){
var tpl = [
	'<div class="datepicker ui-d-n">',
	'	<div class="datepicker__mask"></div>',
	'	<div class="datepicker__main">',
	'		<div class="datepicker__header">',
	'			<div class="datepicker__time-toggle"></div>',
	'			<div class="datepicker__time-selector-list">',
	'				<div class="datepicker__time-selector-item">',
	'					<a href="javascript:;" class="datepicker__time-selector-arrow datepicker__time-selector-prev" id="_j_year_prev">&lt;</a>',
	'					<a href="javascript:;" class="datepicker__time-selector-text" id="_j_year_text">{year}年</a>',
	'					<a href="javascript:;" class="datepicker__time-selector-arrow datepicker__time-selector-next" id="_j_year_next">&gt;</a>',
	'				</div>',
	'				<div class="datepicker__time-selector-item">',
	'					<a href="javascript:;" class="datepicker__time-selector-arrow datepicker__time-selector-prev" id="_j_month_prev">&lt;</a>',
	'					<a href="javascript:;" class="datepicker__time-selector-text" id="_j_month_text">{month}月</a>',
	'					<a href="javascript:;" class="datepicker__time-selector-arrow datepicker__time-selector-next" id="_j_month_next" >&gt;</a>',
	'				</div>',
	'			</div>',
	'		</div>',
	'		<div class="datepicker__panel">',
	'			<ul class="datepicker__week-list">',
	'				<li class="datepicker__week-item">日</li>',
	'				<li class="datepicker__week-item">一</li>',
	'				<li class="datepicker__week-item">二</li>',
	'				<li class="datepicker__week-item">三</li>',
	'				<li class="datepicker__week-item">四</li>',
	'				<li class="datepicker__week-item">五</li>',
	'				<li class="datepicker__week-item">六</li>',
	'			</ul>',
	'			<div class="datepicker__day-wrap">',
	'				<ul class="datepicker__day-list datepicker__day-list-curr">',
	'					{all_days}',
	'				</ul>',
	'			</div>',
	'		</div>',
	'		',
	'		<div class="datepicker__footer">',
	'			<div class="datepicker__btn" id="_j_confirm_btn">确定</div>',
	'			<div class="datepicker__btn" id="_j_cancel_btn">取消</div>',
	'		</div>',
	'	</div>',
	'</div>'
].join("");

module.exports = tpl;

},{}],6:[function(require,module,exports){
/**
 * @author: zimyuan
 * @last-edit-date: 2015-01-23
 */

var util = {
	inheritPrototype: function(subClass, superClass) {
		var prototype = Object.create(superClass.prototype);

		prototype.constructor = subClass;
		subClass.prototype    = prototype; 
	},

	extend: function(_old, _new) {
		for ( var key in _old ) {
			_new[key] = _old[key];
		}
	},

	format: function(tpl, obj) {
	    tpl = tpl + '';
	    return tpl.replace(/\{(\w+)\}/g, function(m, n) {
	        return obj[n] !== undefined ? obj[n].toString() : m;
	    });
	},

	// http://stackoverflow.com/questions/13823188/android-4-1-change-transition-and-webkittransition-defiend-how-to-properly-de
	whichTransitionEvent: function() {
	    var t,
	    	el = document.createElement('fakeelement');
	    	transitions = {
		        'OTransition'       :'oTransitionEnd',
		        'MSTransition'      :'msTransitionEnd',
		        'MozTransition'     :'transitionend',
		        'WebkitTransition'  :'webkitTransitionEnd',
		        'transition' 		:'transitionEnd'
		    };

	    for(t in transitions){
	        if( el.style[t] !== undefined ){
	            return transitions[t];
	        }
	    }

	    return false;
	}
};

module.exports = util;

},{}]},{},[1]);
