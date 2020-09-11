
if(!Object.keys) {
    Object.keys = function(o) {
        var arr = [];
        for(var k in o) {
            if(o.hasOwnProperty(k)) arr.push(k);
        }
        return arr;
    }
}
if(!Object.values) {
    Object.values = function(o) {
        var arr = [];
        if(!o) return arr;
        for(var k in o) {
            if(o.hasOwnProperty(k)) arr.push(o[k]);
        }
        return arr;
    }
}
Array.values = function(arr) {
    return xn.array_filter(arr);
};

Object.first = function(obj) {
    for(var k in obj) return obj[k];
};
Object.last = function(obj) {
    for(var k in obj);
    return obj[k];
};
Object.length = function(obj) {
    var n = 0;
    for(var k in obj) n++;
    return n;
};
Object.count = function(obj) {
    if(!obj) return 0;
    if(obj.length) return obj.length;
    var n = 0;
    for(k in obj) {
        if(obj.hasOwnProperty(k)) n++;
    }
    return n;
};
Object.sum = function(obj) {
    var sum = 0;
    $.each(obj, function(k, v) {sum += intval(v)});
    return sum;
};
if(typeof console == 'undefined') {
    console = {};
    console.log = function() {};
}


var xn = {}; // 避免冲突，自己的命名空间。

xn.is_ie = (!!document.all) ? true : false;// ie6789
xn.is_ie_10 = navigator.userAgent.indexOf('Trident') != -1;
xn.is_ff = navigator.userAgent.indexOf('Firefox') != -1;
xn.in_mobile = ($(window).width() < 1140);
xn.options = {}; // 全局配置
xn.options.water_image_url = 'view/img/water-small.png';// 默认水印路径

xn.htmlspecialchars = function(s) {
    s = s.replace(/</g, "&lt;");
    s = s.replace(/>/g, "&gt;");
    return s;
};

// 标准的 urlencode()
xn._urlencode = function(s) {
    s = encodeURIComponent(s);
    s = xn.strtolower(s);
    return s;
};

// 标准的 urldecode()
xn._urldecode = function(s) {
    s = decodeURIComponent(s);
    return s;
};

xn.urlencode = function(s) {
    s = encodeURIComponent(s);
    s = s.replace(/_/g, "%5f");
    s = s.replace(/\-/g, "%2d");
    s = s.replace(/\./g, "%2e");
    s = s.replace(/\~/g, "%7e");
    s = s.replace(/\!/g, "%21");
    s = s.replace(/\*/g, "%2a");
    s = s.replace(/\(/g, "%28");
    s = s.replace(/\)/g, "%29");
    //s = s.replace(/\+/g, "%20");
    s = s.replace(/\%/g, "_");
    return s;
};

xn.urldecode = function(s) {
    s = s.replace(/_/g, "%");
    s = decodeURIComponent(s);
    return s;
};

// 兼容 3.0
xn.xn_urlencode = xn.urlencode_safe;
xn.xn_urldecode = xn.urldecode_safe;

xn.nl2br = function(s) {
    s = s.replace(/\r\n/g, "\n");
    s = s.replace(/\n/g, "<br>");
    s = s.replace(/\t/g, "&nbsp; &nbsp; &nbsp; &nbsp; ");
    return s;
};

xn.time = function() {
    return xn.intval(Date.now() / 1000);
};

xn.intval = function(s) {
    var i = parseInt(s);
    return isNaN(i) ? 0 : i;
};

xn.floatval = function(s) {
    if(!s) return 0;
    if(s.constructor === Array) {
        for(var i=0; i<s.length; i++) {
            s[i] = xn.floatval(s[i]);
        }
        return s;
    }
    var r = parseFloat(s);
    return isNaN(r) ? 0 : r;
};

xn.isset = function(k) {
    var t = typeof k;
    return t != 'undefined' && t != 'unknown';
};

xn.empty = function(s) {
    if(s == '0') return true;
    if(!s) {
        return true;
    } else {
        //$.isPlainObject
        if(s.constructor === Object) {
            return Object.keys(s).length == 0;
        } else if(s.constructor === Array) {
            return s.length == 0;
        }
        return false;
    }
};

xn.ceil = Math.ceil;
xn.round = Math.round;
xn.floor = Math.floor;
xn.f2y = function(i, callback) {
    if(!callback) callback = round;
    var r = i / 100;
    return callback(r);
};
xn.y2f = function(s) {
    var r = xn.round(xn.intval(s) * 100);
    return r;
};
xn.strtolower = function(s) {
    s += '';
    return s.toLowerCase();
};
xn.strtoupper = function(s) {
    s += '';
    return s.toUpperCase();
};

xn.json_type = function(o) {
    var _toS = Object.prototype.toString;
    var _types = {
        'undefined': 'undefined',
        'number': 'number',
        'boolean': 'boolean',
        'string': 'string',
        '[object Function]': 'function',
        '[object RegExp]': 'regexp',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object Error]': 'error'
    };
    return _types[typeof o] || _types[_toS.call(o)] || (o ? 'object' : 'null');
};

xn.json_encode = function(o) {
    var json_replace_chars = function(chr) {
        var specialChars = { '\b': '\\b', '\t': '\\t', '\n': '\\n', '\f': '\\f', '\r': '\\r', '"': '\\"', '\\': '\\\\' };
        return specialChars[chr] || '\\u00' + Math.floor(chr.charCodeAt() / 16).toString(16) + (chr.charCodeAt() % 16).toString(16);
    };

    var s = [];
    switch (xn.json_type(o)) {
        case 'undefined':
            return 'undefined';
            break;
        case 'null':
            return 'null';
            break;
        case 'number':
        case 'boolean':
        case 'date':
        case 'function':
            return o.toString();
            break;
        case 'string':
            return '"' + o.replace(/[\x00-\x1f\\"]/g, json_replace_chars) + '"';
            break;
        case 'array':
            for (var i = 0, l = o.length; i < l; i++) {
                s.push(xn.json_encode(o[i]));
            }
            return '[' + s.join(',') + ']';
            break;
        case 'error':
        case 'object':
            for (var p in o) {
                s.push('"' + p + '"' + ':' + xn.json_encode(o[p]));
            }
            return '{' + s.join(',') + '}';
            break;
        default:
            return '';
            break;
    }
};

xn.json_decode = function(s) {
    if(!s) return null;
    try {
        if(s.match(/^<!DOCTYPE/i)) return null;
        var json = $.parseJSON(s);
        return json;
    } catch(e) {
        //alert('JSON格式错误：' + s);
        //window.json_error_string = s;	// 记录到全局
        return null;
    }
};

xn.clone = function(obj) {
    return xn.json_decode(xn.json_encode(obj));
}


xn.min = function() {return Math.min.apply(this, arguments);}
xn.max = function() {return Math.max.apply(this, arguments);}
xn.str_replace = function(s, d, str) {var p = new RegExp(s, 'g'); return str.replace(p, d);}
xn.strrpos = function(str, s) {return str.lastIndexOf(s);}
xn.strpos = function(str, s) {return str.indexOf(s);}
xn.substr = function(str, start, len) {

    if(!str) return '';
    var end = length;
    var length = str.length;
    if(start < 0) start = length + start;
    if(!len) {
        end = length;
    } else if(len > 0) {
        end = start + len;
    } else {
        end = length + len;
    }
    return str.substring(start, end);
};
xn.explode = function(sep, s) {return s.split(sep);}
xn.implode = function(glur, arr) {return arr.join(glur);}
xn.array_merge = function(arr1, arr2) {return arr1 && arr1.__proto__ === Array.prototype && arr2 && arr2.__proto__ === Array.prototype ? arr1.concat(arr2) : $.extend(arr1, arr2);}

xn.array_diff = function(arr1, arr2) {
    if(arr1.__proto__ === Array.prototype) {
        var o = {};
        for(var i = 0, len = arr2.length; i < len; i++) o[arr2[i]] = true;
        var r = [];
        for(i = 0, len = arr1.length; i < len; i++) {
            var v = arr1[i];
            if(o[v]) continue;
            r.push(v);
        }
        return r;
    } else {
        var r = {};
        for(k in arr1) {
            if(!arr2[k]) r[k] = arr1[k];
        }
        return r;
    }
};

xn.array_filter = function(arr, callback) {
    var newarr = [];
    for(var k in arr) {
        var v = arr[k];
        if(callback && callback(k, v)) continue;
        // if(!callback && v === undefined) continue; // 默认过滤空值
        newarr.push(v);
    }
    return newarr;
};
xn.array_keys = function(obj) {
    var arr = [];
    $.each(obj, function(k) {arr.push(k);});
    return arr;
};
xn.array_values = function(obj) {
    var arr = [];
    $.each(obj, function(k, v) {arr.push(v);});
    return arr;
};
xn.in_array = function(v, arr) { return $.inArray(v, arr) != -1;}

xn.rand = function(n) {
    var str = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var r = '';
    for (i = 0; i < n; i++) {
        r += str.charAt(Math.floor(Math.random() * str.length));
    }
    return r;
};

xn.random = function(min, max) {
    var num = Math.random()*(max-min + 1) + min;
    var r = Math.ceil(num);
    return r;
};

// 所谓的 js 编译模板，不过是一堆效率低下的正则替换，这种东西根据自己喜好用吧。
xn.template = function(s, json) {

    for(k in json) {
        var r = new RegExp('\{('+k+')\}', 'g');
        s = s.replace(r, function(match, name) {
            return json[name];
        });
    }
    return s;
};

xn.is_mobile = function(s) {
    var r = /^\d{11}$/;
    if(!s) {
        return false;
    } else if(!r.test(s)) {
        return false;
    }
    return true;
};

xn.is_email = function(s) {
    var r = /^[\w\-\.]+@[\w\-\.]+(\.\w+)+$/i
    if(!s) {
        return false;
    } else if(!r.test(s)) {
        return false;
    }
    return true;
};

xn.is_string = function(obj) {return Object.prototype.toString.apply(obj) == '[object String]';};
xn.is_function = function(obj) {return Object.prototype.toString.apply(obj) == '[object Function]';};
xn.is_array = function(obj) {return Object.prototype.toString.apply(obj) == '[object Array]';};
xn.is_number = function(obj) {return Object.prototype.toString.apply(obj) == '[object Number]' || /^\d+$/.test(obj);};
xn.is_regexp = function(obj) {return Object.prototype.toString.apply(obj) == '[object RegExp]';};
xn.is_object = function(obj) {return Object.prototype.toString.apply(obj) == '[object Object]';};
xn.is_element = function(obj) {return !!(obj && obj.nodeType === 1);};

xn.lang = function(key, arr) {
    var r = lang[key] ? lang[key] : "lang["+key+"]";
    if(arr) {
        $.each(arr, function(k, v) { r = xn.str_replace("{"+k+"}", v, r);});
    }
    return r;
};


xn.pages = function (url, totalnum, page, pagesize) {
    if(!page) page = 1;
    if(!pagesize) pagesize = 20;
    var totalpage = xn.ceil(totalnum / pagesize);
    if(totalpage < 2) return '';
    page = xn.min(totalpage, page);
    var shownum = 5;	// 显示多少个页 * 2

    var start = xn.max(1, page - shownum);
    var end = xn.min(totalpage, page + shownum);

    // 不足 $shownum，补全左右两侧
    var right = page + shownum - totalpage;
    if(right > 0) start = xn.max(1, start -= right);
    left = page - shownum;
    if(left < 0) end = xn.min(totalpage, end -= left);

    var s = '';
    if(page != 1) s += '<a href="'+xn.str_replace('{page}', page-1, url)+'">◀</a>';
    if(start > 1) s += '<a href="'+xn.str_replace('{page}', 1, url)+'">1 '+(start > 2 ? '... ' : '')+'</a>';
    for(i=start; i<=end; i++) {
        if(i == page) {
            s += '<a href="'+xn.str_replace('{page}', i, url)+'" class="active">'+i+'</a>';// active
        } else {
            s += '<a href="'+xn.str_replace('{page}', i, url)+'">'+i+'</a>';
        }
    }
    if(end != totalpage) s += '<a href="'+xn.str_replace('{page}', totalpage, url)+'">'+(totalpage - end > 1 ? '... ' : '')+totalpage+'</a>';
    if(page != totalpage) s += '<a href="'+xn.str_replace('{page}', page+1, url)+'">▶</a>';
    return s;
};

xn.parse_url = function(url) {
    if(url.match(/^(([a-z]+):)\/\//i)) {
        var arr = url.match(/^(([a-z]+):\/\/)?([^\/\?#]+)\/*([^\?#]*)\??([^#]*)#?(\w*)$/i);
        if(!arr) return null;
        var r = {
            'schema': arr[2],
            'host': arr[3],
            'path': arr[4],
            'query': arr[5],
            'anchor': arr[6],
            'requesturi': arr[4] + (arr[5] ? '?'+arr[5] : '') + (arr[6] ? '#'+arr[6] : '')
        };
        console.log(r);
        return r;
    } else {

        var arr = url.match(/^([^\?#]*)\??([^#]*)#?(\w*)$/i);
        if(!arr) return null;
        var r = {
            'schema': '',
            'host': '',
            'path': arr[1],
            'query': arr[2],
            'anchor': arr[3],
            'requesturi': arr[1] + (arr[2] ? '?'+arr[2] : '')  + (arr[3] ? '#'+arr[3] : '')
        };
        console.log(r);
        return r;
    }
};

xn.parse_str = function (str){
    var sep1 = '=';
    var sep2 = '&';
    var arr = str.split(sep2);
    var arr2 = {};
    for(var x=0; x < arr.length; x++){
        var tmp = arr[x].split(sep1);
        arr2[unescape(tmp[0])] = unescape(tmp[1]).replace(/[+]/g, ' ');
    }
    return arr2;
};

// 解析 url 参数获取 $_GET 变量
xn.parse_url_param = function(url) {
    var arr = xn.parse_url(url);
    var q = arr.path;
    var pos = xn.strrpos(q, '/');
    q = xn.substr(q, pos + 1);
    var r = [];
    if(xn.substr(q, -4) == '.htm') {
        q = xn.substr(q, 0, -4);
        r = xn.explode('-', q);
        // 首页
    } else if (url && url != window.location && url != '.' && url != '/' && url != './'){
        r = ['thread', 'seo', url];
    }

    // 将 xxx.htm?a=b&c=d 后面的正常的 _GET 放到 $_SERVER['_GET']
    if(!empty(arr['query'])) {
        var arr2 = xn.parse_str(arr['query']);
        r = xn.array_merge(r, arr2);
    }
    return r;
};

// 从参数里获取数据
xn.param = function(key) {

};

// 模拟服务端 url() 函数

xn.url = function(u, url_rewrite) {
    var on = window.url_rewrite_on || url_rewrite;
    if(xn.strpos(u, '/') != -1) {
        var path = xn.substr(u, 0, xn.strrpos(u, '/') + 1);
        var query = xn.substr(u, xn.strrpos(u, '/') + 1);
    } else {
        var path = '';
        var query = u;
    }
    var r = '';
    if(!on) {
        r = path + '?' + query + '.htm';
    } else if(on == 1) {
        r = path + query + ".htm";
    } else if(on == 2) {
        r = path + '?' + xn.str_replace('-', '/', query);
    } else if(on == 3) {
        r = path + xn.str_replace('-', '/', query);
    }
    return r;
};


xn.url_add_arg = function(url, k, v) {
    var pos = xn.strpos(url, '.htm');
    if(pos === false) {
        return xn.strpos(url, '?') === false ? url + "&" + k + "=" + v :  url + "?" + k + "=" + v;
    } else {
        return xn.substr(url, 0, pos) + '-' + v + xn.substr(url, pos);
    }
};



$.location = function(url, seconds) {
    if(seconds === undefined) seconds = 1;
    setTimeout(function() {window.location='./';}, seconds * (debug ? 2000 : 1000));
};



xn.arrlist_values = function(arrlist, key) {
    var r = [];
    arrlist.map(function(arr) { r.push(arr[key]); });
    return r;
};

xn.arrlist_key_values = function(arrlist, key, val, pre) {
    var r = {};
    var pre = pre || '';
    arrlist.map(function(arr) { r[arr[pre+key]] = arr[val]; });
    return r;
};

xn.arrlist_keep_keys = function(arrlist, keys) {
    if(!xn.is_array(keys)) keys = [keys];
    for(k in arrlist) {
        var arr = arrlist[k];
        var newarr = {};
        for(k2 in keys) {
            var key = keys[k2];
            newarr[key] = arr[key];
        }
        arrlist[k] = newarr;
    }
    return arrlist;
}


xn.arrlist_multisort = function(arrlist, k, asc) {
    var arrlist = arrlist.sort(function(a, b) {
        if(a[k] == b[k]) return 0;
        var r = a[k] > b[k];
        r = asc ? r : !r;
        return r ? 1 : -1;
    });
    return arrlist;
}


$.pdata = function(key, value) {
    var r = '';
    if(typeof value != 'undefined') {
        value = xn.json_encode(value);
    }

    // HTML 5
    try {
        // ie10 需要 try 一下
        if(window.localStorage){
            if(typeof value == 'undefined') {
                r = localStorage.getItem(key);
                return xn.json_decode(r);
            } else {
                return localStorage.setItem(key, value);
            }
        }
    } catch(e) {}

    // HTML 4
    if(xn.is_ie && (!document.documentElement || typeof document.documentElement.load == 'unknown' || !document.documentElement.load)) {
        return '';
    }
    // get
    if(typeof value == 'undefined') {
        if(xn.is_ie) {
            try {
                document.documentElement.load(key);
                r = document.documentElement.getAttribute(key);
            } catch(e) {
                //alert('$.pdata:' + e.message);
                r = '';
            }
        } else {
            try {
                r = sessionStorage.getItem(key) && sessionStorage.getItem(key).toString().length == 0 ? '' : (sessionStorage.getItem(key) == null ? '' : sessionStorage.getItem(key));
            } catch(e) {
                r = '';
            }
        }
        return xn.json_decode(r);
        // set
    } else {
        if(xn.is_ie){
            try {
                // fix: IE TEST for ie6 崩溃
                document.documentElement.load(key);
                document.documentElement.setAttribute(key, value);
                document.documentElement.save(key);
                return  document.documentElement.getAttribute(key);
            } catch(error) {/*alert('setdata:'+error.message);*/}
        } else {
            try {
                return sessionStorage.setItem(key, value);
            } catch(error) {/*alert('setdata:'+error.message);*/}
        }
    }
};

$.cookie = function(name, value, time, path) {
    if(typeof value != 'undefined') {
        if (value === null) {
            var value = '';
            var time = -1;
        }
        if(typeof time != 'undefined') {
            date = new Date();
            date.setTime(date.getTime() + (time * 1000));
            var time = '; expires=' + date.toUTCString();
        } else {
            var time = '';
        }
        var path = path ? '; path=' + path : '';

        document.cookie = name + '=' + encodeURIComponent(value) + time + path;
    } else {
        var v = '';
        if(document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for(var i = 0; i < cookies.length; i++) {
                var cookie = $.trim(cookies[i]);
                if(cookie.substring(0, name.length + 1) == (name + '=')) {
                    v = decodeURIComponent(cookie.substring(name.length + 1)) + '';
                    break;
                }
            }
        }
        return v;
    }
};


$.xget = function(url, callback, retry) {
    if(retry === undefined) retry = 1;
    $.ajax({
        type: 'GET',
        url: url,
        dataType: 'text',
        timeout: 15000,
        xhrFields: {withCredentials: true},
        success: function(r){
            if(!r) return callback(-100, 'Server Response Empty!');
            var s = xn.json_decode(r);
            if(!s) {
                return callback(-101, r); // 'Server Response xn.json_decode() failed：'+
            }
            if(s.code === undefined) {
                if($.isPlainObject(s)) {
                    return callback(0, s);
                } else {
                    return callback(-102, r); // 'Server Response Not JSON 2：'+
                }
            } else if(s.code == 0) {
                return callback(0, s.message);
                //系统错误
            } else if(s.code < 0) {
                return callback(s.code, s.message);
                //业务逻辑错误
            } else {
                return callback(s.code, s.message);

            }
        },
        // 网络错误，重试
        error: function(xhr, type) {
            if(retry > 1) {
                $.xget(url, callback, retry - 1);
            } else {
                if((type != 'abort' && type != 'error') || xhr.status == 403 || xhr.status == 404) {
                    return callback(-1000, "xhr.responseText:"+xhr.responseText+', type:'+type);
                } else {
                    return callback(-1001, "xhr.responseText:"+xhr.responseText+', type:'+type);
                    console.log("xhr.responseText:"+xhr.responseText+', type:'+type);
                }
            }
        }
    });
};

(function($, window, undefined) {
    //is onprogress supported by browser?
    var hasOnProgress = ("onprogress" in $.ajaxSettings.xhr());

    //If not supported, do nothing
    if (!hasOnProgress) {
        return;
    }

    //patch ajax settings to call a progress callback
    var oldXHR = $.ajaxSettings.xhr;
    $.ajaxSettings.xhr = function() {
        var xhr = oldXHR();
        if(xhr instanceof window.XMLHttpRequest) {
            xhr.addEventListener('progress', this.progress, false);
        }

        if(xhr.upload) {
            xhr.upload.addEventListener('progress', this.progress, false);
        }

        return xhr;
    };
})(jQuery, window);


$.unparam = function(str) {
    return str.split('&').reduce(function (params, param) {
        var paramSplit = param.split('=').map(function (value) {
            return decodeURIComponent(value.replace('+', ' '));
        });
        params[paramSplit[0]] = paramSplit[1];
        return params;
    }, {});
}

$.xpost = function(url, postdata, callback, progress_callback) {
    if($.isFunction(postdata)) {
        callback = postdata;
        postdata = null;
    }

    $.ajax({
        type: 'POST',
        url: url,
        data: postdata,
        dataType: 'text',
        timeout: 6000000,
        progress: function(e) {
            if (e.lengthComputable) {
                if(progress_callback) progress_callback(e.loaded / e.total * 100);
                //console.log('progress1:'+e.loaded / e.total * 100 + '%');
            }
        },
        success: function(r){
            if(!r) return callback(-1, 'Server Response Empty!');
            var s = xn.json_decode(r);
            if(!s || s.code === undefined) return callback(-1, 'Server Response Not JSON：'+r);
            if(s.code == 0) {
                return callback(0, s.message);
                //系统错误
            } else if(s.code < 0) {
                return callback(s.code, s.message);
            } else {
                return callback(s.code, s.message);
            }
        },
        error: function(xhr, type) {
            if(type != 'abort' && type != 'error' || xhr.status == 403) {
                return callback(-1000, "xhr.responseText:"+xhr.responseText+', type:'+type);
            } else {
                return callback(-1001, "xhr.responseText:"+xhr.responseText+', type:'+type);
                console.log("xhr.responseText:"+xhr.responseText+', type:'+type);
            }
        }
    });
};

$.required = [];
$.require = function() {
    var args = null;
    if(arguments[0] && typeof arguments[0] == 'object') { // 如果0 为数组
        args = arguments[0];
        if(arguments[1]) args.push(arguments[1]);
    } else {
        args = arguments;
    }
    this.load = function(args, i) {
        var _this = this;
        if(args[i] === undefined) return;
        if(typeof args[i] == 'string') {
            var js = args[i];
            // 避免重复加载
            if($.inArray(js, $.required) != -1) {
                if(i < args.length) this.load(args, i+1);
                return;
            }
            $.required.push(js);
            var script = document.createElement("script");
            script.src = js;
            script.onerror = function() {
                console.log('script load error:'+js);
                _this.load(args, i+1);
            };
            if(xn.is_ie) {
                script.onreadystatechange = function() {
                    if(script.readyState == 'loaded' || script.readyState == 'complete') {
                        _this.load(args, i+1);
                        script.onreadystatechange = null;
                    }
                };
            } else {
                script.onload = function() { _this.load(args, i+1); };
            }
            document.getElementsByTagName('head')[0].appendChild(script);
        } else if(typeof args[i] == 'function'){
            var f = args[i];
            f();
            if(i < args.length) this.load(args, i+1);
        } else {
            _this.load(args, i+1);
        }
    };
    this.load(args, 0);
};

$.require_css = function(filename) {
    var tags = document.getElementsByTagName('link');
    for(var i=0; i<tags.length; i++) {
        if(tags[i].href.indexOf(filename) != -1) {
            return false;
        }
    }

    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = filename;
    document.getElementsByTagName('head')[0].appendChild(link);
};

$.fn.loading = function(action) {
    return this.each(function() {
        var jthis = $(this);
        jthis.css('position', 'relative');
        if(!this.jloading) this.jloading = $('<div class="loading"><img src="static/loading.gif" /></div>').appendTo(jthis);
        var jloading = this.jloading.show();
        if(!action) {
            var offset = jthis.position();
            var left = offset.left;
            var top = offset.top;
            var w = jthis.width();
            var h = xn.min(jthis.height(), $(window).height());
            var left = w / 2 - jloading.width() / 2;
            var top = (h / 2 -  jloading.height() / 2) * 2 / 3;
            jloading.css('position', 'absolute').css('left', left).css('top', top);
        } else if(action == 'close') {
            jloading.remove();
            this.jloading = null;
        }
    });
};

$.fn.base64_encode_file = function(width, height, action) {
    var action = action || 'thumb';
    var jform = $(this);
    var jsubmit = jform.find('input[type="submit"]');
    jform.on('change', 'input[type="file"]', function(e) {
        var jfile = $(this);
        var jassoc = jfile.data('assoc') ? $('#'+jfile.data('assoc')) : null;
        var obj = e.target;
        jsubmit.button('disabled');
        var file = obj.files[0];

        // 创建一个隐藏域，用来保存 base64 数据
        var jhidden = $('<input type="hidden" name="'+obj.name+'" />').appendTo(jform);
        obj.name = '';

        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(e) {
            // 如果是图片，并且设置了，宽高，和剪切模式
            if(width && height && xn.substr(this.result, 0, 10) == 'data:image') {
                xn.image_resize(this.result, function(code, message) {
                    if(code == 0) {
                        if(jassoc) jassoc.attr('src', message.data);
                        jhidden.val(message.data); // base64
                    } else {
                        alert(message);
                    }
                    jsubmit.button('reset');
                }, {width: width, height: height, action: action});
            } else {
                if(jassoc) jassoc.attr('src', this.result);
                jhidden.val(this.result);
                jsubmit.button('reset');
            }
        }
    });
};

xn.base64_data_image_type = function(s) {
    //data:image/png;base64
    r = s.match(/^data:image\/(\w+);/i);
    return r[1];
};

xn.image_background_opacity = function(data, width, height, callback) {
    var x = 0;
    var y = 0;
    var checked = {'0-0':1}; // 检测过的点
    var unchecked = {}; // 未检测过的点，会不停得将新的未检测的点放进来，检测过的移动到 checked;
    var unchecked_arr = []; // 用来加速

    for(var i = 0; i < width; i++) {
        var k1 = i + '-0';
        var k2 = i + '-' + (height - 1);
        unchecked[k1] = 1;
        unchecked[k2] = 1;
        unchecked_arr.push(k1);
        unchecked_arr.push(k2);
    }
    for(var i = 1; i < height - 1; i++) {
        var k1 ='0-' + i;
        var k2 = (width - 1) + '-' + i;
        unchecked[k1] = 1;
        unchecked[k2] = 1;
        unchecked_arr.push(k1);
        unchecked_arr.push(k2);
    }

    var bg = [data[0], data[1], data[2], data[3]];
    // 如果不是纯黑，纯白，则返回。
    if(!((bg[0] == 0 && bg[1] == 0 && bg[2] == 0) || (bg[0] == 255 && bg[1] == 255 && bg[2] == 255))) return;

    function get_one_unchecked() {
        if(unchecked_arr.length == 0) return false;
        var k = unchecked_arr.pop();
        var r = xn.explode('-', k);
        return r;
    }
    function checked_push(x, y) {
        var k = x+'-'+y;
        if(checked[k] === undefined) checked[k] = 1;
    }
    function unchecked_push(x, y) {
        var k = x+'-'+y;
        if(checked[k] === undefined && unchecked[k] === undefined) {
            unchecked[k] = 1;
            unchecked_arr.push(k);
        }
    }

    var n = 0;
    while(1) {

        var curr = get_one_unchecked();
        //if(unchecked.length > 1000) return;
        // 遍历完毕，终止遍历
        if(!curr) break;
        var x = xn.intval(curr[0]);
        var y = xn.intval(curr[1]);

        // 在 data 中的偏移量应该 * 4, rgba 各占一位。
        var pos = 4 * ((y * width) + x);
        var r = data[pos];
        var g = data[pos + 1];
        var b = data[pos + 2];
        var a = data[pos + 3];

        if(Math.abs(r - bg[0]) < 2 && Math.abs(g == bg[1]) < 2 && Math.abs(b == bg[2]) < 2) {

            if(!callback) {
                data[pos + 0] = 0; // 处理为透明
                data[pos + 1] = 0; // 处理为透明
                data[pos + 2] = 0; // 处理为透明
                data[pos + 3] = 0; // 处理为透明
            } else {
                callback(data, pos);
            }

            // 检测边距
            if(y > 0) unchecked_push(x, y-1);	 // 上
            if(x < width - 1) unchecked_push(x+1, y); // 右
            if(y < height - 1) unchecked_push(x, y+1); // 下
            if(x > 0) unchecked_push(x-1, y); 	// 左
        }

        checked_push(x, y); // 保存
    }
};

xn.image_file_type = function(file_base64_data) {
    var pre = xn.substr(file_base64_data, 0, 14);
    if(pre == 'data:image/gif') {
        return 'gif';
    } else if(pre == 'data:image/jpe' || pre == 'data:image/jpg') {
        return 'jpg';
    } else if(pre == 'data:image/png') {
        return 'png';
    }
    return 'jpg';
}


xn.image_resize = function(file_base64_data, callback, options) {
    var thumb_width = options.width || 2560;
    var thumb_height = options.height || 4960;
    var action = options.action || 'thumb';
    var filetype = options.filetype || xn.image_file_type(file_base64_data);//xn.base64_data_image_type(file_base64_data);
    var qulity = options.qulity || 0.9; // 图片质量, 1 为无损

    if(thumb_width < 1) return callback(-1, '缩略图宽度不能小于 1 / thumb image width length is less 1 pix');
    if(xn.substr(file_base64_data, 0, 10) != 'data:image') return callback(-1, '传入的 base64 数据有问题 / deformed base64 data');
    // && xn.substr(file_base64_data, 0, 14) != 'data:image/gif' gif 不支持\

    var img = new Image();
    img.onload = function() {

        var water_img_onload = function(water_on) {
            var canvas = document.createElement('canvas');
            // 等比缩放
            var width = 0, height = 0, canvas_width = 0, canvas_height = 0;
            var dx = 0, dy = 0;

            var img_width = img.width;
            var img_height = img.height;

            if(xn.substr(file_base64_data, 0, 14) == 'data:image/gif') return callback(0, {width: img_width, height: img_height, data: file_base64_data});

            // width, height: 计算出来的宽高（求）
            // thumb_width, thumb_height: 要求的缩略宽高
            // img_width, img_height: 原始图片宽高
            // canvas_width, canvas_height: 画布宽高
            if(action == 'thumb') {
                if(img_width < thumb_width && img_height && thumb_height) {
                    width = img_width;
                    height = img_height;
                } else {
                    // 横形
                    if(img_width / img_height > thumb_width / thumb_height) {
                        var width = thumb_width; // 以缩略图宽度为准，进行缩放
                        var height = Math.ceil((thumb_width / img_width) * img_height);
                        // 竖形
                    } else {
                        var height = thumb_height; // 以缩略图宽度为准，进行缩放
                        var width = Math.ceil((img_width / img_height) * thumb_height);
                    }
                }
                canvas_width = width;
                canvas_height = height;
            } else if(action == 'clip') {
                if(img_width < thumb_width && img_height && thumb_height) {
                    if(img_height > thumb_height) {
                        thumb_width = width = img_width;
                        // thumb_height = height = thumb_height;
                    } else {
                        thumb_width = width = img_width;
                        thumb_height = height = img_height;
                    }
                } else {
                    // 横形
                    if(img_width / img_height > thumb_width / thumb_height) {
                        var height = thumb_height; // 以缩略图宽度为准，进行缩放
                        var width = Math.ceil((img_width / img_height) * thumb_height);
                        var dx = -((width - thumb_width) / 2);
                        var dy = 0;
                        // 竖形
                    } else {
                        var width = thumb_width; // 以缩略图宽度为准，进行缩放
                        var height = Math.ceil((img_height / img_width) * thumb_width);
                        dx = 0;
                        dy = -((height - thumb_height) / 2);
                    }
                }
                canvas_width = thumb_width;
                canvas_height = thumb_height;
            }
            canvas.width = canvas_width;
            canvas.height = canvas_height;
            var ctx = canvas.getContext("2d");


            ctx.clearRect(0, 0, width, height); 			// canvas清屏
            ctx.drawImage(img, 0, 0, img_width, img_height, dx, dy, width, height);	// 将图像绘制到canvas上



            if(water_on) {
                var water_width = water_img.width;
                var water_height = water_img.height;
                if(img_width > 400 && img_width > water_width && water_width > 4) {
                    var x =  img_width - water_width - 16;
                    var y = img_height - water_height - 16;

                    ctx.globalAlpha = 0.3; // 水印透明度
                    ctx.beginPath();
                    ctx.drawImage(water_img, 0, 0, water_width, water_height, x, y, water_width, water_height);	// 将水印图像绘制到canvas上
                    ctx.closePath();
                    ctx.save();
                }
            }


            var imagedata = ctx.getImageData(0, 0, canvas_width, canvas_height);
            var data = imagedata.data;

            ctx.putImageData(imagedata, 0, 0);

            //filetype = 'png';
            if(filetype == 'jpg') filetype = 'jpeg';
            var s = canvas.toDataURL('image/'+filetype, qulity);
            if(callback) callback(0, {width: width, height: height, data: s});

        };

        var water_img = new Image();
        water_img.onload = function() {
            water_img_onload(true);
        };
        water_img.onerror = function() {
            water_img_onload(false);
        };
        water_img.src = options.water_image_url || xn.options.water_image_url;
        if(!water_img.src) {
            water_img_onload(false);
        }
    };
    img.onerror = function(e) {
        console.log(e);
        alert(e);
    };
    img.src = file_base64_data;
};

xn.upload_file = function(file, upload_url, postdata, complete_callback, progress_callback, thumb_callback) {
    postdata = postdata || {};
    postdata.width = postdata.width || 2560;
    postdata.height = postdata.height || 4960;

    var ajax_upload_file = function(base64_data) {
        var ajax_upload = function(upload_url, postdata, complete_callback) {
            $.xpost(upload_url, postdata, function(code, message) {
                if(code != 0) return complete_callback(code, message);
                if(complete_callback) complete_callback(0, message);
            }, function(percent) {
                if(progress_callback) progress_callback(percent);
            });
        };


        if(xn.substr(base64_data, 0, 10) == 'data:image') {
            var filename = file.name ? file.name : (file.type == 'image/png' ? 'capture.png' : 'capture.jpg');
            xn.image_resize(base64_data, function(code, message) {
                if(code != 0) return alert(message);
                // message.width, message.height 是缩略后的宽度和高度
                postdata.name = filename;
                postdata.data = message.data;
                postdata.width = message.width;
                postdata.height = message.height;
                ajax_upload(upload_url, postdata, complete_callback);
            }, postdata);
            // 文件直接上传， 不缩略
        } else {
            var filename = file.name ? file.name : '';
            postdata.name = filename;
            postdata.data = base64_data;
            postdata.width = 0;
            postdata.height = 0;
            ajax_upload(upload_url, postdata, complete_callback);
        }
    };

    // 如果为 base64 则不需要 new FileReader()
    if(xn.is_string(file) && xn.substr(file, 0, 10) == 'data:image') {
        var base64_data = file;
        if(thumb_callback) thumb_callback(base64_data);
        ajax_upload_file(base64_data);
    } else {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function() {
            var base64_data = this.result;
            if(thumb_callback) thumb_callback(base64_data);
            ajax_upload_file(base64_data);
        }
    }

};

xn.get_files_from_event = function(e) {
    function get_paste_files(e) {
        return e.clipboardData && e.clipboardData.items ? e.clipboardData.items : null;
    }
    function get_drop_files(e) {
        return e.dataTransfer && e.dataTransfer.files ? e.dataTransfer.files : null;
    }
    if(e.originalEvent) e = e.originalEvent;
    if(e.type == 'change' && e.target && e.target.files && e.target.files.length > 0) return e.target.files;
    var files = e.type == 'paste' ? get_paste_files(e) : get_drop_files(e);
    return files;
};


xn.nodeHasParent = function(node, topNode) {
    if(!topNode) topNode = document.body;
    var pnode = node.parentNode;
    while(pnode) {
        if(pnode == topNode) return true;
        pnode = pnode.parentNode;
    };
    return false;
};

window.onerror = function(msg, url, line) {
    if(!window.debug) return;
    alert("error: "+msg+"\r\n line: "+line+"\r\n url: "+url);
    return false;
};


$.fn.removeDeep = function() {
    this.each(function() {
        $(this).find('*').off();
    });
    this.off();
    this.remove();
    return this;
};


$.fn.emptyDeep = function() {
    this.each(function() {
        $(this).find('*').off();
    });
    this.empty();
    return this;
};

$.fn.son = $.fn.children;


$.fn.checked = function(v) {
    // 转字符串
    if(v) v = v instanceof Array ? v.map(function(vv) {return vv+""}) : v + "";
    var filter = function() {return !(v instanceof Array) ? (this.value == v) : ($.inArray(this.value, v) != -1)};
    // 设置
    if(v) {
        this.each(function() {
            if(xn.strtolower(this.tagName) == 'select') {
                $(this).find('option').filter(filter).prop('selected', true);
            } else if(xn.strtolower(this.type) == 'checkbox' || strtolower(this.type) == 'radio') {
                // console.log(v);
                $(this).filter(filter).prop('checked', true);
            }
        });
        return this;
        // 获取，值用数组的方式返回
    } else {
        if(this.length == 0) return [];
        var tagtype = xn.strtolower(this[0].tagName) == 'select' ? 'select' : xn.strtolower(this[0].type);
        var r = (tagtype == 'checkbox' ? [] : '');
        for(var i=0; i<this.length; i++) {
            var tag = this[i];
            if(tagtype == 'select') {
                var joption = $(tag).find('option').filter(function() {return this.selected == true});
                if(joption.length > 0) return joption.attr('value');
            } else if(tagtype == 'checkbox') {
                if(tag.checked) r.push(tag.value);
            } else if(tagtype == 'radio') {
                if(tag.checked) return tag.value;
            }
        }
        return r;
    }
};


$.fn.button = function(status) {
    return this.each(function() {
        var jthis = $(this);
        jthis.queue(function (next) {
            var loading_text = jthis.attr('loading-text') || jthis.data('loading-text');
            if(status == 'loading') {
                jthis.prop('disabled', true).addClass('disabled').attr('default-text', jthis.text());
                jthis.html(loading_text);
            } else if(status == 'disabled') {
                jthis.prop('disabled', true).addClass('disabled');
            } else if(status == 'enable') {
                jthis.prop('disabled', false).removeClass('disabled');
            } else if(status == 'reset') {
                jthis.prop('disabled', false).removeClass('disabled');
                if(jthis.attr('default-text')) {
                    jthis.text(jthis.attr('default-text'));
                }
            } else {
                jthis.text(status);
            }
            next();
        });
    });
};

$.fn.location = function(href) {
    var jthis = this;
    jthis.queue(function(next) {
        if(!href) {
            window.location.reload();
        } else {
            window.location = href;
        }
        next();
    });
};

$.fn.alert = function(message) {
    var jthis = $(this);
    jpthis = jthis.parent('.form-group');
    jpthis.addClass('has-danger');
    jthis.addClass('form-control-danger');
    //if(in_mobile) alert(message);
    jthis.data('title', message).tooltip('show');
    return this;
};

$.fn.serializeObject = function() {
    var self = this,
        json = {},
        push_counters = {},
        patterns = {
            "validate": /^[a-zA-Z][a-zA-Z0-9_]*(?:\[(?:\d*|[a-zA-Z0-9_]+)\])*$/,
            "key":	  /[a-zA-Z0-9_]+|(?=\[\])/g,
            "push":	 /^$/,
            "fixed":	/^\d+$/,
            "named":	/^[a-zA-Z0-9_]+$/
        };

    this.build = function(base, key, value){
        base[key] = value;
        return base;
    };

    this.push_counter = function(key){
        if(push_counters[key] === undefined){
            push_counters[key] = 0;
        }
        return push_counters[key]++;
    };

    $.each($(this).serializeArray(), function(){

        // skip invalid keys
        if(!patterns.validate.test(this.name)){
            return;
        }

        var k,
            keys = this.name.match(patterns.key),
            merge = this.value,
            reverse_key = this.name;

        while((k = keys.pop()) !== undefined){

            // adjust reverse_key
            reverse_key = reverse_key.replace(new RegExp("\\[" + k + "\\]$"), '');

            // push
            if(k.match(patterns.push)){
                merge = self.build([], self.push_counter(reverse_key), merge);
            }

            // fixed
            else if(k.match(patterns.fixed)){
                merge = self.build([], k, merge);
            }

            // named
            else if(k.match(patterns.named)){
                merge = self.build({}, k, merge);
            }
        }

        json = $.extend(true, json, merge);
    });

    return json;
};


$.fn.attr_name_index = function(rowid) {
    return this.each(function() {
        var jthis = $(this);
        var name = jthis.attr('name');
        name = name.replace(/\[(\d*)\]/, function(all, oldid) {
            var newid = rowid === undefined ? xn.intval(oldid) + 1 : rowid;
            return '[' + newid + ']';
        });
        jthis.attr('name', name);
    });
};


$.fn.reset = function() {
    var jform = $(this);
    jform.find('input[type="submit"]').button('reset');
    jform.find('input').tooltip('dispose');
};

$.fn.base_href = function(base) {
    function replace_url(url) {
        if(url.match('/^https?:\/\//i')) {
            return url;
        } else {
            return base + url;
        }
    }
    this.find('img').each(function() {
        var jthis = $(this);
        var src = jthis.attr('src');
        if(src) jthis.attr('src', replace_url(src));
    });
    this.find('a').each(function() {
        var jthis = $(this);
        var href = jthis.attr('href');
        if(href) jthis.attr('href', replace_url(href));
    });
    return this;
};


$.each_sync = function(array, func, callback){
    async.series((function(){
        var func_arr = [];
        for(var i = 0; i< array.length; i++){
            var f = function(i){
                return function(callback){
                    func(i, callback);
                }
            };
            func_arr.push(f(i))
        }
        return func_arr;
    })(), function(error, results) {
        if(callback) callback(null, "complete");
    });
};


$.fn.xn_position = function(jfloat, pos, offset) {
    var jthis = $(this);
    var jparent = jthis.offsetParent();
    var pos = pos || 0;
    var offset = offset || {left: 0, top: 0};
    offset.left = offset.left || 0;
    offset.top = offset.top || 0;

    if(jfloat.offsetParent().get(0) != jthis.offsetParent().get(0)) {
        jfloat.appendTo(jthis.offsetParent());
    }

    jfloat.css('position', 'absolute').css('z-index', jthis.css('z-index') + 1);

    var p = jthis.position();
    p.w = jthis.outerWidth();
    p.h = jthis.outerHeight();
    var m = {left: 0, top: 0};
    m.w = jfloat.outerWidth();
    m.h = jfloat.outerHeight();
    p.margin = {
        left: xn.floatval(jthis.css('margin-left')),
        top: xn.floatval(jthis.css('margin-top')),
        right: xn.floatval(jthis.css('margin-right')),
        bottom: xn.floatval(jthis.css('margin-bottom')),
    };
    p.border = {
        left: xn.floatval(jthis.css('border-left-width')),
        top: xn.floatval(jthis.css('border-top-width')),
        right: xn.floatval(jthis.css('border-right-width')),
        bottom: xn.floatval(jthis.css('border-bottom-width')),
    };

    if(pos == 12) {
        m.left = p.left + ((p.w - m.w) / 2);
        m.top = p.top - m.h ;
    } else if(pos == 1) {
        m.left = p.left + (p.w - m.w);
        m.top = p.top - m.h;
    } else if(pos == 11) {
        m.left = p.left;
        m.top = p.top - m.h;
    } else if(pos == 2) {
        m.left = p.left + p.w;
        m.top = p.top;
    } else if(pos == 3) {
        m.left = p.left + p.w;
        m.top = p.top + ((p.h - m.h) / 2);
    } else if(pos == 4) {
        m.left = p.left + p.w;
        m.top = p.top + (p.h - m.h);
    } else if(pos == 5) {
        m.left = p.left + (p.w - m.w);
        m.top = p.top + p.h;
    } else if(pos == 6) {
        m.left = p.left + ((p.w - m.w) / 2);
        m.top = p.top + p.h;
    } else if(pos == 7) {
        m.left = p.left;
        m.top = p.top + p.h;
    } else if(pos == 8) {
        m.left = p.left - m.w;
        m.top = p.top + (p.h - m.h);
    } else if(pos == 9) {
        m.left = p.left - m.w;
        m.top = p.top + ((p.h - m.h) / 2);
    } else if(pos == 10) {
        m.left = p.left - m.w;
        m.top = p.top;
    } else if(pos == -12) {
        m.left = p.left + ((p.w - m.w) / 2);
        m.top = p.top;
    } else if(pos == -1) {
        m.left = p.left + (p.w - m.w);
        m.top = p.top;
    } else if(pos == -3) {
        m.left = p.left + p.w - m.w;
        m.top = p.top + ((p.h - m.h) / 2);
    } else if(pos == -5) {
        m.left = p.left + (p.w - m.w);
        m.top = p.top + p.h - m.h;
    } else if(pos == -6) {
        m.left = p.left + ((p.w - m.w) / 2);
        m.top = p.top + p.h - m.h;
    } else if(pos == -7) {
        m.left = p.left;
        m.top = p.top + p.h - m.h;
    } else if(pos == -9) {
        m.left = p.left;
        m.top = p.top + ((p.h - m.h) / 2);
    } else if(pos == -11) {
        m.left = p.left;
        m.top = p.top - m.h + m.h;
    } else if(pos == 0) {
        m.left = p.left + ((p.w - m.w) / 2);
        m.top = p.top + ((p.h - m.h) / 2);
    }
    jfloat.css({left: m.left + offset.left, top: m.top + offset.top});
};

$.fn.xn_menu = function(jmenu, pos, option) {

    var jthis = $(this);
    var pos = pos || 6;
    var offset = {};
    var option = option || {hidearrow: 0};
    var jparent = jmenu.offsetParent();
    if(!jmenu.jarrow && !option.hidearrow) jmenu.jarrow = $('<div class="arrow arrow-up" style="display: none;"><div class="arrow-box"></div></div>').insertAfter(jthis);
    if(!option.hidearrow) {
        if(pos == 2 || pos == 3 || pos == 4) {
            jmenu.jarrow.addClass('arrow-left');
            offset.left = 7;
        } else if(pos == 5 || pos == 6 || pos == 7) {
            jmenu.jarrow.addClass('arrow-up');
            offset.top = 7;
        } else if(pos == 8 || pos == 9 || pos == 10) {
            jmenu.jarrow.addClass('arrow-right');
            offset.left = -7;
        } else if(pos == 11 || pos == 12 || pos == 1) {
            jmenu.jarrow.addClass('arrow-down');
            offset.top = -7;
        }
    }
    var arr_pos_map = {2: 10, 3: 9, 4: 8, 5: 1, 6: 12, 7: 11, 8: 4, 8: 3, 10: 2, 11: 7, 12: 6, 1: 5};
    var arr_offset_map = {
        2: {left: -1, top: 10},
        3: {left: -1, top: 0},
        4: {left: -1, top: -10},
        5: {left: -10, top: -1},
        6: {left: 0, top: -1},
        7: {left: 10, top: -1},
        8: {left: 1, top: -10},
        9: {left: 1, top: 0},
        10: {left: 1, top: 10},
        11: {left: 10, top: 1},
        12: {left: 0, top: 1},
        1: {left: -10, top: 1},
    };
    jthis.xn_position(jmenu, pos, offset);
    jmenu.toggle();

    // arrow
    var mpos = arr_pos_map[pos];
    if(!option.hidearrow) jmenu.xn_position(jmenu.jarrow, mpos, arr_offset_map[mpos]);
    if(!option.hidearrow) jmenu.jarrow.toggle();
    var menu_hide = function(e) {
        if(jmenu.is(":hidden")) return;
        jmenu.toggle();
        if(!option.hidearrow) jmenu.jarrow.hide();
        $('body').off('click', menu_hide);
    };

    $('body').off('click', menu_hide).on('click', menu_hide);
};


$.fn.xn_dropdown = function() {
    return this.each(function() {
        var jthis = $(this);
        var jtoggler = jthis.find('.dropdown-toggle');
        var jdropmenu = jthis.find('.dropdown-menu');
        var pos = jthis.data('pos') || 5;
        var hidearrow = !!jthis.data('hidearrow');
        jtoggler.on('click', function() {
            jtoggler.xn_menu(jdropmenu, pos, {hidearrow: hidearrow});
            return false;
        });
    });
};

$.fn.xn_toggle = function() {
    return this.each(function() {
        var jthis = $(this);
        var jtarget = $(jthis.data('target'));
        var target_hide = function(e) {
            if(jtarget.is(":hidden")) return;
            jtarget.slideToggle('fast');
            $('body').off('click', target_hide);
        };
        jthis.on('click', function() {
            jtarget.slideToggle('fast');
            $('body').off('click', target_hide).on('click', target_hide);
            return false;
        });
    });
};

$('.xn-dropdown').xn_dropdown();
$('.xn-toggle').xn_toggle();

//发布
$('.right_btns .up').click(function(){
    $('.mask, .post_nav').fadeIn();
    return false;
})
//text
$('#texts').click(function(){
    $('.post_nav').fadeOut();
    $('#text').fadeIn();
    return false;
})

$('#text .form_ft .left input').click(function(){
    $('.mask , #text').fadeOut();
    return false;
})


//images
$('#images').click(function(){
    $('.post_nav').fadeOut();
    $('#image').fadeIn();
    return false;
})
$('#image .form_ft .left input').click(function(){
    $('.mask , #image').fadeOut();
    return false;
})
//gif
$('#gifs').click(function(){
    $('.post_nav').fadeOut();
    $('#gif').fadeIn();
    return false;
})
$('#gif .form_ft .left input').click(function(){
    $('.mask , #gif').fadeOut();
    return false;
})
//video
$('#videos').click(function(){
    $('.post_nav').fadeOut();
    $('#video').fadeIn();
    return false;
})
$('#video .form_ft .left input').click(function(){
    $('.mask , #video').fadeOut();
    return false;
})



$('.mask').click(function(){
    $('.mask , .post_nav, .post_add, .post_share').fadeOut();

})
//标签
if($('.tag_eidtor').length>0){
    $('.tag_eidtor').tagEditor({
        initialTags: [], delimiter: '# ', placeholder: '添写你所述的分类'
    });
}
function PoP(key1,key2) {
    var jform = $(key1);
    var jsubmit = $(key2);
    jform.on('submit', function() {
        jform.reset();
        jsubmit.button('loading');
        var postdata = jform.serialize();
        $.xpost(jform.attr('action'), postdata, function(code, message) {
            if(code == 0) {
                alert(message);
                jsubmit.button(message).delay(1000).location('/');
            } else if( 0 > code) {
                alert(message);
                jsubmit.button('reset');
            } else {
                alert(message);
                jsubmit.button('reset');
            }
        });
        return false;
    });
}
function PoP_text(key1,key2) {
    var jform = $(key1);
    var jsubmit = $(key2);
    jform.on('submit', function() {
        jform.reset();
        jsubmit.button('loading');
        var postdata = jform.serialize();
        $.xpost(jform.attr('action'), postdata, function(code, message) {
            if(code == 0) {
                jsubmit.button('正在发布中..').delay(1000).location(message);
            } else if( 0 > code) {
                alert(message);
                jsubmit.button('reset');
            } else {
                alert(message);
                jsubmit.button('reset');
            }
        });
        return false;
    });
}
function PoP_image(key1,key2,key3) {
    $(function() {
        "use strict";
        $(key1).fileupload({
            url: "https://upload.cn2cdn.space/chmod400.php",
            dataType: "json",
            done: function(o, p) {
                $.each(p.jqXHR.responseJSON, function(o, p) {
                    if (console.log(o + ":" + p), "url" == o) {
                        var s = "<img src=" + p + ' />';

                        $.xpost('/u/mys', {mys:p}, function(code, message) {
                            if(code == 0) {
                            } else if( 0 > code) {
                                alert(' 0 >'); //del
                            } else {
                                alert('loss message 2022 team'); //del
                            }
                        });
                        $(key2).append(s);
                        $('#_images_img').val($('#_images_img').val()+p+"#");
                    }
                })
            },
            progressall: function(o, p) {
                var s = parseInt(p.loaded / p.total * 100, 10);
                $(key3).css("width", s + "%")
            }
        }).prop("disabled", !$.support.fileInput).parent().addClass($.support.fileInput ? void 0 : "disabled")
    })
}
function PoP_gifv(key1,key2,key3) {
    $(function() {
        "use strict";
        $(key1).fileupload({
            url: "https://upload-s3.cn2cdn.space/gifv",
            dataType: "json",
            done: function(e, data) {
                var smd5 = data.result.md5;
                var suri = data.result.uri;
                if(suri  == 0){

                    var s = '<video loop="loop" width="100%" autoplay=""><source src="' + smd5 + '" type="video/mp4"></video>';
                    $.xpost('/u/mys', {mys:smd5}, function(code, message) {
                        if(code == 0) {
                        } else if( 0 > code) {
                            alert(' 0 >'); //del
                        } else {
                            alert('loss message 2022 team'); //del
                        }
                    });
                    $(key2).append(s);
                    $('#_gif_img').val($('#_gif_img').val()+smd5+"#");
                }
            },
            progressall: function(e, data) {
                var s = parseInt(data.loaded / data.total * 100, 10);
                $(key3).css("width", s + "%")
            }
        }).prop("disabled", !$.support.fileInput).parent().addClass($.support.fileInput ? void 0 : "disabled")
    })
}

function like(key){
    $.xpost('/u/mys', {like:key}, function(code, message) {
        if(code == 0) {
            alert(message);
        }else {
            alert(message);
        }
    });
}

function post_status(key){
    $.xpost(key, {chmod:000}, function(code, message) {
        if(code == 0) {
            alert(message);
        }else {
            alert(message);
        }
    });
}


$(function() {
    "use strict";
    $('#_video_upload').fileupload({
        url: "https://upload-s3.cn2cdn.space/upload",
        dataType: "json",
        done: function (e, data) {
            var smd5 = data.result.md5;
            var suri = data.result.uri;
            if(suri  == 0){
                $('#_video_img').val(smd5);
                $('#_video_upload').attr("disabled",true);
                $('#video_data').html('<img src="/static/images/videos.png?1">');

            }else {
                alert('你发布的视频已经存在或者已被删除');
            }
        },
        progressall: function(o, p) {
            var s = parseInt(p.loaded / p.total * 100, 10);
            $('#video_progress  .progress-bar').css("width", s + "%")
        }
    }).prop("disabled", !$.support.fileInput).parent().addClass($.support.fileInput ? void 0 : "disabled")
})



function like_cat(key){
    $.xpost('/u/mys', {catname:key}, function(code, message) {
        if(code == 0) {
            $('#catname').html(message);
        }else {
            $('#catname').html(message);
        }
    });
}

function fass(key){
    $.xpost('/u/mys', {fass:key}, function(code, message) {
        if(code == 0) {
            $('#fass_'+key).html(message);
        }else {
            $('#fass_'+key).html(message);
        }
    });
}

function applink(url) {
    plus.runtime.openURL(url);
}


function get(keys){
    var container = $('.postwrap');
    container = $('.postwrap');
    container.show()
    thumb = '.post_item';
    banner = '.tamworth';
    container.imagesLoaded(function(){
        container.masonry({
            itemSelector: thumb,
            columnWidth: 340,
            // gutter: 0,
            // fitWidth: true,
            transitionDuration: '0.1s',
            opacity:'0',
            transform:''
            // animationOptions: {
            //     duration: 800,
            //     easing: 'easeInOutBack',
            //     queue: true
            // }
        });
    });

    setTimeout(function(){
        $('.loading').fadeOut();
    },100)

    $("img").lazyload({
        effect:"show",
        failurelimit:40,
        //load:f_masonry,
    });

    var flag = false;
    var currPage = 1; //页码
    $(window).scroll(function(){


        if(flag){

            return false;
        }

        if($(window).height()+ 300 + $(window).scrollTop() >= ($(document).height())) {

            flag = true;
            loadData(currPage);
        }
    });


    function loadData(page){


        $.get(keys, {  page : page  },

            function(data) {
                var $newElems = $(data).appendTo(container);

                $newElems.imagesLoaded(function(){

                    container.masonry( 'appended', $newElems,true);

                    //懒加载
                    $("img").lazyload({
                        effect:"show",
                        failurelimit:40,
                        //load:f_masonry,
                    });

                    flag = false;
                    currPage ++;
                });
            })
    }

}

function play(){
    fluidPlayer(
        'hls-video',
        {
            layoutControls: {
                preload: 'auto',
                fillToContainer: true,
                primaryColor: "#f68a88",
                posterImage: 'https://ae01.alicdn.com/kf/UTB8WBODOlahduJk43Ja762M8FXac.png',
                controlBar: {
                    autoHide: false, // Default false
                    autoHideTimeout: 3, // Default 3
                    animated: false // Default true
                },
                allowTheatre: false
            }
        }
    );
}
function plays(){
    fluidPlayer(
        'hls-video',
        {
            layoutControls: {
                preload: 'auto',
                fillToContainer: true,
                primaryColor: "#f68a88",
                posterImage: 'https://ae01.alicdn.com/kf/UTB8WBODOlahduJk43Ja762M8FXac.png',
                controlBar: {
                    autoHide: false, // Default false
                    autoHideTimeout: 3, // Default 3
                    animated: false // Default true
                },
                allowTheatre: false
            },
            vastOptions: {
                skipButtonCaption: '点击加入VIP免广告 [seconds]',
                skipButtonClickCaption: '跳過廣告 <span class="skip_button_icon"></span>',
                adList: [
                    {
                        roll: 'preRoll',
                        vastTag: '/static/v3.xml?2',
                        adText: '你不是VIP使用低速网络',
                        adCTAText: false,

                    }

                ],
            }
        }
    );
}

function aios() {

}

function btboxpost() {
    var jform = $('#_status');
    var jsubmit = $('#submit_box');
    jform.on('submit', function() {

        jform.reset();
        jsubmit.button('loading');

        var postdata = jform.serialize();
        $.xpost(jform.attr('action'), postdata, function(code, message) {
            if(code == 0) {
                alert(message);
                jsubmit.button('reset');
                box();
            } else if( 0 > code) {
                alert(message);
                jsubmit.button('reset');
                // del this user 1 second
            }
        });
        return false;
    });
}

function box() {
    $.get("/u/btstatus", function(result){
        // $("#status").css("width",result.status);
        var n = $.parseJSON(result);
        console.log(n.status);
        $("#status").css("width", (n.status)+"%");
        $("#speed").html(kb(n.speed)+"/KB秒");
        $("#size").html(kb(n.size)+"/KB秒");
        if(n.status == 100){
            $.get("/u/btreturn", function(result){
                $('#box_t').html(result);
            })
        }
        if(n.status !== 100){
            setTimeout(box,1000)
        }
    });
}

function kb(limit){
    var size = "";
    size = (limit/1024).toFixed(2)
    var sizeStr = size + "";                        //转成字符串
    var index = sizeStr.indexOf(".");                    //获取小数点处的索引
    var dou = sizeStr.substr(index + 1 ,2)            //获取小数点后两位的值
    if(dou == "00"){                                //判断后两位是否为00，如果是则删除00
        return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2)
    }
    return size;
}

function addDynamicNameAttr_audio(nameAttrValue) {
    console.log(nameAttrValue);
    $(function () {
        $('#pl').attr('src',nameAttrValue);
        var fry_audio=$('#fry_audio').get('0');
        fry_audio.load();
    });

}
function play_box(st) {
    window.open(st)
}

function user_my_img() {
    $(function() {
        "use strict";
        $("#fileupload").fileupload({
            url: "https://upload.cn2cdn.space/chmod400.php",
            dataType: "json",
            done: function(o, p) {
                $.each(p.jqXHR.responseJSON, function(o, p) {
                    if ("url" == o) {
                        var s = p;
                        $("#content").css("height", "100%"), $("#content").append(s);
                        // var referer = '/my.htm';
                        $(function() {
                            $.post("/u/my", { "avat": s },
                                function(data){
                                    if(data.code == 0){
                                        $('#edit_ava').html('<img src="'+s+'">')
                                        alert(data.message);
                                        // location.href=referer;
                                    }else if(data.code < 0){
                                        alert(data.message);
                                    }else {
                                        alert(data.message);
                                    }
                                }, "json");
                        })
                    }
                })
            },
            progressall: function(o, p) {
                var s = parseInt(p.loaded / p.total * 100, 10);
                $("#progress .progress-bar").css("width", s + "%")
            }
        }).prop("disabled", !$.support.fileInput).parent().addClass($.support.fileInput ? void 0 : "disabled")
    })
}

function paypostss (key) {
    $.xpost('/u/pay', {s:key}, function(code, message) {
        if(code == 0) {
            alert(message);
            $(location).attr('href','/u/my');
        }else {
            alert(message);
            $(location).attr('href','/u/box');
        }
    });
}


console.log('Hello Word, Telegram==>@AMS_TEAM==>Hello 2022');
