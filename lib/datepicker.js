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
