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

      	find_check : function(terms  , checking_obj      )
      	{

      			var checked = true;
      			for( key in terms )
      			{
      					if(!checking_obj){ checked = false; continue; }
      					if(!checking_obj[key]){ checked = false; continue; }

      					var term_value = terms[key];
      					var checking_obj_value = checking_obj[key];

      					if(( Object.prototype.toString.call( term_value ) === '[object Array]' ))
      					{
      							checked = term_value.some(function( term_value_inner ){
      								return helpers.find_check({ x:term_value_inner },{ x:checking_obj_value});
      							});
      					}
      					else
      					{
      							var parsing_array = /^(%?|<=?|<?|>?|>=?|><?)([^%<=>]+)(%?)$/i.exec( term_value );

      							var prolog_term = parsing_array[1];
      							var body_term = parsing_array[2];
      							var epilog_term = parsing_array[3]

      							if( prolog_term == '>=' )
      							{
      									checked = checked && ( parseFloat(checking_obj_value) >= parseFloat(body_term)) ;
      							}
      							else if( prolog_term == '<=' )
      							{
      									checked = checked &&
      									(
      										parseFloat(checking_obj_value) <= parseFloat(body_term)
      									);
      							}
      							else if( prolog_term == '><' )
      							{
      									var parsing_body_term_array = /^([^;]+)(;+)([^;]+)$/i.exec( body_term );
      									var body_term_first = parsing_body_term_array[1];
      									var body_term_second = parsing_body_term_array[3];

      									checked = checked &&
      									(
      										parseFloat(checking_obj_value) >= parseFloat(body_term_first)
      										&&
      										parseFloat(checking_obj_value) <= parseFloat(body_term_second)
      									);
      							}
      							else if( prolog_term == '>' )
      							{
      									checked = checked && ( parseFloat(checking_obj_value) > parseFloat(body_term) );
      							}
      							else if( prolog_term == '<' )
      							{
      									checked = checked && ( parseFloat(checking_obj_value) < parseFloat(body_term) );
      							}
      							else if( prolog_term == '%' && epilog_term == '%' )
      							{
      									checked = checked && ( checking_obj_value.toLowerCase().indexOf( body_term.toLowerCase() ) >= 0 );
      							}
      							else if( prolog_term == '%' )
      							{
      									checked = checked && ( checking_obj_value.toLowerCase().indexOf( body_term.toLowerCase() ) == (checking_obj_value.length - body_term.length ) );
      							}
      							else if( epilog_term == '%' )
      							{
      									checked = checked && ( checking_obj_value.toLowerCase().indexOf( body_term.toLowerCase() ) == 0 );
      							}
      							else
      							{
      									checked = checked && ( checking_obj_value == term_value );
      							}
      					}

      					if(!checked) return false;
      			}

      			return checked;
      	}
    }

    if (!Array.prototype.find)
    {
        Array.prototype.find = function(condition)
        {

            var len = this.length >>> 0, from = 0, result = [], _self = this;

            result = this.filter(function( element ){

                return ( helpers.find_check( condition, element ) );

            });

            if( result.length > 0 )
                return result;
            else
                return [];
        };

        Array.prototype.pages = function(elt)
        {
            var len = this.length >>> 0, from = (elt.page)*elt.elements_on_page, to = (elt.page+1)*elt.elements_on_page, result = [];  if(to>len)to=len;

            result.count_of_pages = Math.ceil( len / elt.elements_on_page );
            result.current_page = elt.page;

            for (; from < to; from++)
            {
                result.push(this[from]);
            }

            if( result.length > 0 )
                return result;
            else
                return [];
        };
    }
})();