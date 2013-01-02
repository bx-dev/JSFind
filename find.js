;(function(){

    //https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/filter#Compatibility/////////////////////////////
    //
        if (!Array.prototype.filter)
        {
          Array.prototype.filter = function(fun /*, thisp */)
          {
        	"use strict";

        	if (this === void 0 || this === null)
        	  throw new TypeError();

        	var t = Object(this);
        	var len = t.length >>> 0;
        	if (typeof fun !== "function")
        	  throw new TypeError();

        	var res = [];
        	var thisp = arguments[1];
        	for (var i = 0; i < len; i++)
        	{
        	  if (i in t)
        	  {
        		var val = t[i]; // in case fun mutates this
        		if (fun.call(thisp, val, i, t))
        		  res.push(val);
        	  }
        	}

        	return res;
          };
        }
    //
    //https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/filter#Compatibility/////////////////////////////


    //https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/some/////////////////////////////////////////////
    //
        if (!Array.prototype.some)
        {
          Array.prototype.some = function(fun /*, thisp */)
          {
        	"use strict";

        	if (this === void 0 || this === null)
        	  throw new TypeError();

        	var t = Object(this);
        	var len = t.length >>> 0;
        	if (typeof fun !== "function")
        	  throw new TypeError();

        	var thisp = arguments[1];
        	for (var i = 0; i < len; i++)
        	{
        	  if (i in t && fun.call(thisp, t[i], i, t))
        		return true;
        	}

        	return false;
          };
        }
    //
    //https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/some/////////////////////////////////////////////


    //https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/indexOf//////////////////////////////////
    //
        if (!Array.prototype.indexOf) {
            Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
                "use strict";
                if (this == null) {
                    throw new TypeError();
                }
                var t = Object(this);
                var len = t.length >>> 0;
                if (len === 0) {
                    return -1;
                }
                var n = 0;
                if (arguments.length > 1) {
                    n = Number(arguments[1]);
                    if (n != n) { // shortcut for verifying if it's NaN
                        n = 0;
                    } else if (n != 0 && n != Infinity && n != -Infinity) {
                        n = (n > 0 || -1) * Math.floor(Math.abs(n));
                    }
                }
                if (n >= len) {
                    return -1;
                }
                var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
                for (; k < len; k++) {
                    if (k in t && t[k] === searchElement) {
                        return k;
                    }
                }
                return -1;
            }
        }
    //
    //https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/indexOf//////////////////////////////////




    /* private functions */
	var helpers = {

        //			 function(условия, проверяемый_объект)
      	find_check : function(terms  , checking_obj      )
      	{
      			/*
      				terms == {
      								name: "%rua",
      								price: ">100"
      				}

      				checking_obj == {
      									name:"Chianti Classico",
      									price:"540.00",
      									year:"Array"
      				}
      			*/

      			var checked = true;
      			for( key in terms )//перебираем все параметры в условие
      			{
      					/*
      						checking_obj == {
      											name:"Chianti Classico",
      											price:"540.00",
      											year:"Array"
      						}

      						checking_obj_value == "Chianti Classico";
      					*/

      					if(!checking_obj){ checked = false; continue; } //если проверяемый объект не объект
      					if(!checking_obj[key]){ checked = false; continue; } //если проверяемый объект не содержит ключа, который есть в условии

      					var term_value = terms[key]; // ">1000"
      					var checking_obj_value = checking_obj[key];// "4000"

      					//console.log('условие: ', term_value);

      					if(( Object.prototype.toString.call( term_value ) === '[object Array]' ))//( is_array( term_value ) )//пресеты фильтрующие ИЛИ
      					{
      							/*
      								term_value = [ >111, 222 ]
      							*/
      							checked = term_value.some(function( term_value_inner ){
      								//console.log('term_value_inner:', term_value_inner, '  checking_obj_value:', checking_obj_value);
      								//console.log('[].find_check({ x:term_value_inner },{ x:checking_obj_value}):', [].find_check({ x:term_value_inner },{ x:checking_obj_value}));
      								//return (checking_obj_value == term_value_inner);
      								return helpers.find_check({ x:term_value_inner },{ x:checking_obj_value});
      							});
      					}
      					else
      					{
      							var parsing_array = /^(%?|<=?|<?|>?|>=?|><?)([^%<=>]+)(%?)$/i.exec( term_value );

      							//console.log(parsing_array);

      							var prolog_term = parsing_array[1];
      							var body_term = parsing_array[2];
      							var epilog_term = parsing_array[3]

      							//console.log('prolog_term:', prolog_term, '  body_term:', body_term, '  epilog_term:' ,epilog_term);

      							if( prolog_term == '>=' )//пресеты фильтрующие
      							{
      									//console.log(  );
      									checked = checked && ( parseFloat(checking_obj_value) >= parseFloat(body_term)) ;
      							}
      							else if( prolog_term == '<=' )//пресеты фильтрующие
      							{
      									//console.log(  );
      									checked = checked &&
      									(
      										parseFloat(checking_obj_value) <= parseFloat(body_term)
      									);
      							}
      							else if( prolog_term == '><' )//пресеты фильтрующие
      							{
      									//console.log(  );
      									var parsing_body_term_array = /^([^;]+)(;+)([^;]+)$/i.exec( body_term );
      									var body_term_first = parsing_body_term_array[1];
      									var body_term_second = parsing_body_term_array[3];

      									//console.log('body_term_first=',body_term_first,' body_term_second=',body_term_second);

      									checked = checked &&
      									(
      										parseFloat(checking_obj_value) >= parseFloat(body_term_first)
      										&&
      										parseFloat(checking_obj_value) <= parseFloat(body_term_second)
      									);
      							}
      							else if( prolog_term == '>' )//пресеты фильтрующие
      							{
      									//console.log(  );
      									checked = checked && ( parseFloat(checking_obj_value) > parseFloat(body_term) );
      							}
      							else if( prolog_term == '<' )//пресеты фильтрующие
      							{
      									//console.log(  );
      									checked = checked && ( parseFloat(checking_obj_value) < parseFloat(body_term) );
      							}
      							else if( prolog_term == '%' && epilog_term == '%' )//пресеты фильтрующие по вхождению подстроки
      							{
      									checked = checked && ( checking_obj_value.toLowerCase().indexOf( body_term.toLowerCase() ) >= 0 );
      							}
      							else if( prolog_term == '%' )//пресеты фильтрующие по началу подстроки ( "%text" )
      							{
      									checked = checked && ( checking_obj_value.toLowerCase().indexOf( body_term.toLowerCase() ) == (checking_obj_value.length - body_term.length ) );
      							}
      							else if( epilog_term == '%' )//пресеты фильтрующие по концу подстроки ( "text%" )
      							{
      									checked = checked && ( checking_obj_value.toLowerCase().indexOf( body_term.toLowerCase() ) == 0 );
      							}
      							else//иначе простое сравнение на равенство
      							{
      									//console.log('checking_obj_value: '+checking_obj_value + '  term_value:' + term_value + '  checking_obj.NAME:' + checking_obj.NAME);
      									checked = checked && ( checking_obj_value == term_value );
      							}
      					}


      					if(!checked) return false;//если какое-то условие не прошло, то дальше продолжать не имеет смысла.
      			}

      			return checked;
      	}
    }


    //добавляем для массива метод find
    if (!Array.prototype.find)
    {
        Array.prototype.find = function(condition /*, from*/)
        {

            var len = this.length >>> 0, from = 0, result = [], _self = this;

            result = this.filter(function( element ){

                return ( helpers.find_check( condition, element ) );

            });

            //1//разные варианты одного и того же, выбирал вариант по шустрее
            /*result = function(_self){
                return _self.filter(function(element){

                    return ( _self.find_check( condition, element ) );

                });
            }(this);*/

            //2//разные варианты одного и того же, выбирал вариант по шустрее
            /*result = this.filter(function(_self){
                return function( element ){

                    return ( _self.find_check( condition, element ) );

                }
            }(this));*/

            //3//разные варианты одного и того же, выбирал вариант по шустрее
            /*for (; from < len; from++)//перебираем все элементы массива
            {
                if( this.find_check(condition, this[from]) )//для каждого элемента массива проверяем условие, если оно выполняется добавлем элемент в result
                {
                    result.push(this[from]);
                }
            }*/

            if( result.length > 0 )
                return result;
            else
                return [];
        };

        Array.prototype.pages = function(elt)
        {
            //catalog.pages({ page:0, elements_on_page:12 });
            var len = this.length >>> 0, from = (elt.page)*elt.elements_on_page, to = (elt.page+1)*elt.elements_on_page, result = [];  if(to>len)to=len;

            result.count_of_pages = Math.ceil( len / elt.elements_on_page );
            result.current_page = elt.page;

            //console.log('from('+from+') < to('+to+')');
            for (; from < to; from++)
            {
                result.push(this[from]);
            }


            //console.log('pages.result',result,'pages.length='+result.length);
            if( result.length > 0 )
                return result;
            else
                return [];
        };
    }
})();