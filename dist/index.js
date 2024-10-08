/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var lua_in_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _gfx_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);
/* harmony import */ var _fileSystem_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7);
/* harmony import */ var path_browserify__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8);
/* harmony import */ var path_browserify__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(path_browserify__WEBPACK_IMPORTED_MODULE_3__);





class Game {
    constructor(canvas,script) {
        this.gfx=new _gfx_js__WEBPACK_IMPORTED_MODULE_1__["default"](canvas);
        this.luaEnv=lua_in_js__WEBPACK_IMPORTED_MODULE_0__.createEnv({
            fileExists: p => _fileSystem_js__WEBPACK_IMPORTED_MODULE_2__["default"].exists(path_browserify__WEBPACK_IMPORTED_MODULE_3__.join("./game/",p)),
            loadFile: p => _fileSystem_js__WEBPACK_IMPORTED_MODULE_2__["default"].read(path_browserify__WEBPACK_IMPORTED_MODULE_3__.join("./game/",p)),
        });
        //this.luaEnv.loadLib("gnome",new luainjs.Table(this.generateLib()));
        this.luaScript=this.luaEnv.parseFile(script).exec();
        this.init = this.luaScript.strValues.init;
	    this.update = this.luaScript.strValues.update;
	    this.draw = this.luaScript.strValues.draw;
        this.init();
        setInterval(()=>{this.tick()},1000/this.gfx.fps);
    }

    tick() {
        //this.update();
        //this.draw();
        this.gfx.tick();
    }

    generateLib() {
        let lib = {
            cls:function() {
                this.gfx.cls()
            },

            rectFill:function(x,y,w,h) {
                let X=lua_in_js__WEBPACK_IMPORTED_MODULE_0__.utils.coerceArgToNumber(x,"rectFill",1)
                let Y=lua_in_js__WEBPACK_IMPORTED_MODULE_0__.utils.coerceArgToNumber(y,"rectFill",2)
                let W=lua_in_js__WEBPACK_IMPORTED_MODULE_0__.utils.coerceArgToNumber(w,"rectFill",3)
                let H=lua_in_js__WEBPACK_IMPORTED_MODULE_0__.utils.coerceArgToNumber(h,"rectFill",4)
                this.gfx.rectFill(X,Y,W,H);
            },

            rectStrk:function(x,y,w,h) {
                let X=lua_in_js__WEBPACK_IMPORTED_MODULE_0__.utils.coerceArgToNumber(x,"rectStrk",1);
                let Y=lua_in_js__WEBPACK_IMPORTED_MODULE_0__.utils.coerceArgToNumber(y,"rectStrk",2);
                let W=lua_in_js__WEBPACK_IMPORTED_MODULE_0__.utils.coerceArgToNumber(w,"rectStrk",3);
                let H=lua_in_js__WEBPACK_IMPORTED_MODULE_0__.utils.coerceArgToNumber(h,"rectStrk",4);
                this.gfx.rectStrk(X,Y,W,H);
            },

            pset:function(x,y) {
                let X=lua_in_js__WEBPACK_IMPORTED_MODULE_0__.utils.coerceArgToNumber(x,"pset",1);
                let Y=lua_in_js__WEBPACK_IMPORTED_MODULE_0__.utils.coerceArgToNumber(y,"pset",2);
                this.gfx.pset(X,Y);
            },

            setColor:function(r,g,b) {
                let R=lua_in_js__WEBPACK_IMPORTED_MODULE_0__.utils.coerceArgToNumber(r,"color",1);
                let G=lua_in_js__WEBPACK_IMPORTED_MODULE_0__.utils.coerceArgToNumber(g,"color",2);
                let B=lua_in_js__WEBPACK_IMPORTED_MODULE_0__.utils.coerceArgToNumber(b,"color",3);

                this.gfx.curColor= new this.gfx.RGB(R,G,B);
            }
        }

        return lib
    }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Game);

/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LuaError: () => (/* binding */ LuaError),
/* harmony export */   Table: () => (/* binding */ Table),
/* harmony export */   createEnv: () => (/* binding */ createEnv),
/* harmony export */   utils: () => (/* binding */ utils)
/* harmony export */ });
/* harmony import */ var luaparse__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var luaparse__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(luaparse__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var printj__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);



class LuaError extends Error {
    constructor(message) {
        super();
        this.message = message;
    }
    toString() {
        return `LuaError: ${this.message}`;
    }
}

class Table {
    constructor(initialiser) {
        this.numValues = [undefined];
        this.strValues = {};
        this.keys = [];
        this.values = [];
        this.metatable = null;
        if (initialiser === undefined)
            return;
        if (typeof initialiser === 'function') {
            initialiser(this);
            return;
        }
        if (Array.isArray(initialiser)) {
            this.insert(...initialiser);
            return;
        }
        for (const key in initialiser) {
            if (hasOwnProperty(initialiser, key)) {
                let value = initialiser[key];
                if (value === null)
                    value = undefined;
                this.set(key, value);
            }
        }
    }
    get(key) {
        const value = this.rawget(key);
        if (value === undefined && this.metatable) {
            const mm = this.metatable.get('__index');
            if (mm instanceof Table) {
                return mm.get(key);
            }
            if (typeof mm === 'function') {
                const v = mm.call(undefined, this, key);
                return v instanceof Array ? v[0] : v;
            }
        }
        return value;
    }
    rawget(key) {
        switch (typeof key) {
            case 'string':
                if (hasOwnProperty(this.strValues, key)) {
                    return this.strValues[key];
                }
                break;
            case 'number':
                if (key > 0 && key % 1 === 0) {
                    return this.numValues[key];
                }
        }
        const index = this.keys.indexOf(tostring(key));
        return index === -1 ? undefined : this.values[index];
    }
    getMetaMethod(name) {
        return this.metatable && this.metatable.rawget(name);
    }
    set(key, value) {
        const mm = this.metatable && this.metatable.get('__newindex');
        if (mm) {
            const oldValue = this.rawget(key);
            if (oldValue === undefined) {
                if (mm instanceof Table) {
                    return mm.set(key, value);
                }
                if (typeof mm === 'function') {
                    return mm(this, key, value);
                }
            }
        }
        this.rawset(key, value);
    }
    setFn(key) {
        return v => this.set(key, v);
    }
    rawset(key, value) {
        switch (typeof key) {
            case 'string':
                this.strValues[key] = value;
                return;
            case 'number':
                if (key > 0 && key % 1 === 0) {
                    this.numValues[key] = value;
                    return;
                }
        }
        const K = tostring(key);
        const index = this.keys.indexOf(K);
        if (index > -1) {
            this.values[index] = value;
            return;
        }
        this.values[this.keys.length] = value;
        this.keys.push(K);
    }
    insert(...values) {
        this.numValues.push(...values);
    }
    toObject() {
        const outputAsArray = Object.keys(this.strValues).length === 0 && this.getn() > 0;
        const result = outputAsArray ? [] : {};
        for (let i = 1; i < this.numValues.length; i++) {
            const propValue = this.numValues[i];
            const value = propValue instanceof Table ? propValue.toObject() : propValue;
            if (outputAsArray) {
                const res = result;
                res[i - 1] = value;
            }
            else {
                const res = result;
                res[String(i - 1)] = value;
            }
        }
        for (const key in this.strValues) {
            if (hasOwnProperty(this.strValues, key)) {
                const propValue = this.strValues[key];
                const value = propValue instanceof Table ? propValue.toObject() : propValue;
                const res = result;
                res[key] = value;
            }
        }
        return result;
    }
    getn() {
        const vals = this.numValues;
        const keys = [];
        for (const i in vals) {
            if (hasOwnProperty(vals, i)) {
                keys[i] = true;
            }
        }
        let j = 0;
        while (keys[j + 1]) {
            j += 1;
        }
        if (j > 0 && vals[j] === undefined) {
            let i = 0;
            while (j - i > 1) {
                const m = Math.floor((i + j) / 2);
                if (vals[m] === undefined) {
                    j = m;
                }
                else {
                    i = m;
                }
            }
            return i;
        }
        return j;
    }
}

const FLOATING_POINT_PATTERN = /^[-+]?[0-9]*\.?([0-9]+([eE][-+]?[0-9]+)?)?$/;
const HEXIDECIMAL_CONSTANT_PATTERN = /^(-)?0x([0-9a-fA-F]*)\.?([0-9a-fA-F]*)$/;
function type(v) {
    const t = typeof v;
    switch (t) {
        case 'undefined':
            return 'nil';
        case 'number':
        case 'string':
        case 'boolean':
        case 'function':
            return t;
        case 'object':
            if (v instanceof Table)
                return 'table';
            if (v instanceof Function)
                return 'function';
    }
}
function tostring(v) {
    if (v instanceof Table) {
        const mm = v.getMetaMethod('__tostring');
        if (mm)
            return mm(v)[0];
        return valToStr(v, 'table: 0x');
    }
    if (v instanceof Function) {
        return valToStr(v, 'function: 0x');
    }
    return coerceToString(v);
    function valToStr(v, prefix) {
        const s = v.toString();
        if (s.indexOf(prefix) > -1)
            return s;
        const str = prefix + Math.floor(Math.random() * 0xffffffff).toString(16);
        v.toString = () => str;
        return str;
    }
}
function posrelat(pos, len) {
    if (pos >= 0)
        return pos;
    if (-pos > len)
        return 0;
    return len + pos + 1;
}
function throwCoerceError(val, errorMessage) {
    if (!errorMessage)
        return undefined;
    throw new LuaError(`${errorMessage}`.replace(/%type/gi, type(val)));
}
function coerceToBoolean(val) {
    return !(val === false || val === undefined);
}
function coerceToNumber(val, errorMessage) {
    if (typeof val === 'number')
        return val;
    switch (val) {
        case undefined:
            return undefined;
        case 'inf':
            return Infinity;
        case '-inf':
            return -Infinity;
        case 'nan':
            return NaN;
    }
    const V = `${val}`;
    if (V.match(FLOATING_POINT_PATTERN)) {
        return parseFloat(V);
    }
    const match = V.match(HEXIDECIMAL_CONSTANT_PATTERN);
    if (match) {
        const [, sign, exponent, mantissa] = match;
        let n = parseInt(exponent, 16) || 0;
        if (mantissa)
            n += parseInt(mantissa, 16) / Math.pow(16, mantissa.length);
        if (sign)
            n *= -1;
        return n;
    }
    if (errorMessage === undefined)
        return undefined;
    throwCoerceError(val, errorMessage);
}
function coerceToString(val, errorMessage) {
    if (typeof val === 'string')
        return val;
    switch (val) {
        case undefined:
        case null:
            return 'nil';
        case Infinity:
            return 'inf';
        case -Infinity:
            return '-inf';
    }
    if (typeof val === 'number') {
        return Number.isNaN(val) ? 'nan' : `${val}`;
    }
    if (typeof val === 'boolean') {
        return `${val}`;
    }
    if (errorMessage === undefined)
        return 'nil';
    throwCoerceError(val, errorMessage);
}
function coerceArg(value, coerceFunc, typ, funcName, index) {
    return coerceFunc(value, `bad argument #${index} to '${funcName}' (${typ} expected, got %type)`);
}
function coerceArgToNumber(value, funcName, index) {
    return coerceArg(value, coerceToNumber, 'number', funcName, index);
}
function coerceArgToString(value, funcName, index) {
    return coerceArg(value, coerceToString, 'string', funcName, index);
}
function coerceArgToTable(value, funcName, index) {
    if (value instanceof Table) {
        return value;
    }
    else {
        const typ = type(value);
        throw new LuaError(`bad argument #${index} to '${funcName}' (table expected, got ${typ})`);
    }
}
function coerceArgToFunction(value, funcName, index) {
    if (value instanceof Function) {
        return value;
    }
    else {
        const typ = type(value);
        throw new LuaError(`bad argument #${index} to '${funcName}' (function expected, got ${typ})`);
    }
}
const ensureArray = (value) => (value instanceof Array ? value : [value]);
const hasOwnProperty = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

var utils = /*#__PURE__*/Object.freeze({
    __proto__: null,
    type: type,
    tostring: tostring,
    posrelat: posrelat,
    coerceToBoolean: coerceToBoolean,
    coerceToNumber: coerceToNumber,
    coerceToString: coerceToString,
    coerceArgToNumber: coerceArgToNumber,
    coerceArgToString: coerceArgToString,
    coerceArgToTable: coerceArgToTable,
    coerceArgToFunction: coerceArgToFunction,
    ensureArray: ensureArray,
    hasOwnProperty: hasOwnProperty
});

class Scope {
    constructor(variables = {}) {
        this._variables = variables;
    }
    get(key) {
        return this._variables[key];
    }
    set(key, value) {
        if (hasOwnProperty(this._variables, key) || !this.parent) {
            this.setLocal(key, value);
        }
        else {
            this.parent.set(key, value);
        }
    }
    setLocal(key, value) {
        this._variables[key] = value;
    }
    setVarargs(args) {
        this._varargs = args;
    }
    getVarargs() {
        return this._varargs || (this.parent && this.parent.getVarargs()) || [];
    }
    extend() {
        const innerVars = Object.create(this._variables);
        const scope = new Scope(innerVars);
        scope.parent = this;
        return scope;
    }
}

const isBlock = (node) => node.type === 'IfClause' ||
    node.type === 'ElseifClause' ||
    node.type === 'ElseClause' ||
    node.type === 'WhileStatement' ||
    node.type === 'DoStatement' ||
    node.type === 'RepeatStatement' ||
    node.type === 'FunctionDeclaration' ||
    node.type === 'ForNumericStatement' ||
    node.type === 'ForGenericStatement' ||
    node.type === 'Chunk';
class MemExpr extends String {
    constructor(base, property) {
        super();
        this.base = base;
        this.property = property;
    }
    get() {
        return `__lua.get(${this.base}, ${this.property})`;
    }
    set(value) {
        return `${this.base}.set(${this.property}, ${value})`;
    }
    setFn() {
        return `${this.base}.setFn(${this.property})`;
    }
    toString() {
        return this.get();
    }
    valueOf() {
        return this.get();
    }
}
const UNI_OP_MAP = {
    not: 'not',
    '-': 'unm',
    '~': 'bnot',
    '#': 'len'
};
const BIN_OP_MAP = {
    '+': 'add',
    '-': 'sub',
    '*': 'mul',
    '%': 'mod',
    '^': 'pow',
    '/': 'div',
    '//': 'idiv',
    '&': 'band',
    '|': 'bor',
    '~': 'bxor',
    '<<': 'shl',
    '>>': 'shr',
    '..': 'concat',
    '~=': 'neq',
    '==': 'eq',
    '<': 'lt',
    '<=': 'le',
    '>': 'gt',
    '>=': 'ge'
};
const generate = (node) => {
    switch (node.type) {
        case 'LabelStatement': {
            return `case '${node.label.name}': label = undefined`;
        }
        case 'BreakStatement': {
            return 'break';
        }
        case 'GotoStatement': {
            return `label = '${node.label.name}'; continue`;
        }
        case 'ReturnStatement': {
            const args = parseExpressions(node.arguments);
            return `return ${args}`;
        }
        case 'IfStatement': {
            const clauses = node.clauses.map(clause => generate(clause));
            return clauses.join(' else ');
        }
        case 'IfClause':
        case 'ElseifClause': {
            const condition = expression(node.condition);
            const body = parseBody(node);
            return `if (__lua.bool(${condition})) {\n${body}\n}`;
        }
        case 'ElseClause': {
            const body = parseBody(node);
            return `{\n${body}\n}`;
        }
        case 'WhileStatement': {
            const condition = expression(node.condition);
            const body = parseBody(node);
            return `while(${condition}) {\n${body}\n}`;
        }
        case 'DoStatement': {
            const body = parseBody(node);
            return `\n${body}\n`;
        }
        case 'RepeatStatement': {
            const condition = expression(node.condition);
            const body = parseBody(node);
            return `do {\n${body}\n} while (!(${condition}))`;
        }
        case 'LocalStatement': {
            return parseAssignments(node);
        }
        case 'AssignmentStatement': {
            return parseAssignments(node);
        }
        case 'CallStatement': {
            return generate(node.expression);
        }
        case 'FunctionDeclaration': {
            const getFuncDef = (params) => {
                const paramStr = params.join(';\n');
                const body = parseBody(node, paramStr);
                const argsStr = params.length === 0 ? '' : '...args';
                const returnStr = node.body.findIndex(node => node.type === 'ReturnStatement') === -1 ? '\nreturn []' : '';
                return `(${argsStr}) => {\n${body}${returnStr}\n}`;
            };
            const params = node.parameters.map(param => {
                if (param.type === 'VarargLiteral') {
                    return `$${nodeToScope.get(param)}.setVarargs(args)`;
                }
                return `$${nodeToScope.get(param)}.setLocal('${param.name}', args.shift())`;
            });
            if (node.identifier === null)
                return getFuncDef(params);
            if (node.identifier.type === 'Identifier') {
                const scope = nodeToScope.get(node.identifier);
                const setStr = node.isLocal ? 'setLocal' : 'set';
                return `$${scope}.${setStr}('${node.identifier.name}', ${getFuncDef(params)})`;
            }
            const identifier = generate(node.identifier);
            if (node.identifier.indexer === ':') {
                params.unshift(`$${nodeToScope.get(node)}.setLocal('self', args.shift())`);
            }
            return identifier.set(getFuncDef(params));
        }
        case 'ForNumericStatement': {
            const varName = node.variable.name;
            const start = expression(node.start);
            const end = expression(node.end);
            const step = node.step === null ? 1 : expression(node.step);
            const init = `let ${varName} = ${start}, end = ${end}, step = ${step}`;
            const cond = `step > 0 ? ${varName} <= end : ${varName} >= end`;
            const after = `${varName} += step`;
            const varInit = `$${nodeToScope.get(node.variable)}.setLocal('${varName}', ${varName});`;
            const body = parseBody(node, varInit);
            return `for (${init}; ${cond}; ${after}) {\n${body}\n}`;
        }
        case 'ForGenericStatement': {
            const iterators = parseExpressions(node.iterators);
            const variables = node.variables
                .map((variable, index) => {
                return `$${nodeToScope.get(variable)}.setLocal('${variable.name}', res[${index}])`;
            })
                .join(';\n');
            const body = parseBody(node, variables);
            return `for (let [iterator, table, next] = ${iterators}, res = __lua.call(iterator, table, next); res[0] !== undefined; res = __lua.call(iterator, table, res[0])) {\n${body}\n}`;
        }
        case 'Chunk': {
            const body = parseBody(node);
            return `'use strict'\nconst $0 = __lua.globalScope\nlet vars\nlet vals\nlet label\n\n${body}`;
        }
        case 'Identifier': {
            return `$${nodeToScope.get(node)}.get('${node.name}')`;
        }
        case 'StringLiteral': {
            const S = node.value
                .replace(/([^\\])?\\(\d{1,3})/g, (_, pre, dec) => `${pre || ''}${String.fromCharCode(dec)}`)
                .replace(/\\/g, '\\\\')
                .replace(/`/g, '\\`');
            return `\`${S}\``;
        }
        case 'NumericLiteral': {
            return node.value.toString();
        }
        case 'BooleanLiteral': {
            return node.value ? 'true' : 'false';
        }
        case 'NilLiteral': {
            return 'undefined';
        }
        case 'VarargLiteral': {
            return `$${nodeToScope.get(node)}.getVarargs()`;
        }
        case 'TableConstructorExpression': {
            if (node.fields.length === 0)
                return 'new __lua.Table()';
            const fields = node.fields
                .map((field, index, arr) => {
                if (field.type === 'TableKey') {
                    return `t.rawset(${generate(field.key)}, ${expression(field.value)})`;
                }
                if (field.type === 'TableKeyString') {
                    return `t.rawset('${field.key.name}', ${expression(field.value)})`;
                }
                if (field.type === 'TableValue') {
                    if (index === arr.length - 1 && ExpressionReturnsArray(field.value)) {
                        return `t.insert(...${generate(field.value)})`;
                    }
                    return `t.insert(${expression(field.value)})`;
                }
            })
                .join(';\n');
            return `new __lua.Table(t => {\n${fields}\n})`;
        }
        case 'UnaryExpression': {
            const operator = UNI_OP_MAP[node.operator];
            const argument = expression(node.argument);
            if (!operator) {
                throw new Error(`Unhandled unary operator: ${node.operator}`);
            }
            return `__lua.${operator}(${argument})`;
        }
        case 'BinaryExpression': {
            const left = expression(node.left);
            const right = expression(node.right);
            const operator = BIN_OP_MAP[node.operator];
            if (!operator) {
                throw new Error(`Unhandled binary operator: ${node.operator}`);
            }
            return `__lua.${operator}(${left}, ${right})`;
        }
        case 'LogicalExpression': {
            const left = expression(node.left);
            const right = expression(node.right);
            const operator = node.operator;
            if (operator === 'and') {
                return `__lua.and(${left},${right})`;
            }
            if (operator === 'or') {
                return `__lua.or(${left},${right})`;
            }
            throw new Error(`Unhandled logical operator: ${node.operator}`);
        }
        case 'MemberExpression': {
            const base = expression(node.base);
            return new MemExpr(base, `'${node.identifier.name}'`);
        }
        case 'IndexExpression': {
            const base = expression(node.base);
            const index = expression(node.index);
            return new MemExpr(base, index);
        }
        case 'CallExpression':
        case 'TableCallExpression':
        case 'StringCallExpression': {
            const functionName = expression(node.base);
            const args = node.type === 'CallExpression'
                ? parseExpressionList(node.arguments).join(', ')
                : expression(node.type === 'TableCallExpression' ? node.arguments : node.argument);
            if (functionName instanceof MemExpr && node.base.type === 'MemberExpression' && node.base.indexer === ':') {
                return `__lua.call(${functionName}, ${functionName.base}, ${args})`;
            }
            return `__lua.call(${functionName}, ${args})`;
        }
        default:
            throw new Error(`No generator found for: ${node.type}`);
    }
};
const parseBody = (node, header = '') => {
    const scope = nodeToScope.get(node);
    const scopeDef = scope === undefined ? '' : `const $${scope} = $${scopeToParentScope.get(scope)}.extend();`;
    const body = node.body.map(statement => generate(statement)).join(';\n');
    const goto = nodeToGoto.get(node);
    if (goto === undefined)
        return `${scopeDef}\n${header}\n${body}`;
    const gotoHeader = `L${goto}: do { switch(label) { case undefined:`;
    const gotoParent = gotoToParentGoto.get(goto);
    const def = gotoParent === undefined ? '' : `break; default: continue L${gotoParent}\n`;
    const footer = `${def}} } while (label)`;
    return `${scopeDef}\n${gotoHeader}\n${header}\n${body}\n${footer}`;
};
const expression = (node) => {
    const v = generate(node);
    if (ExpressionReturnsArray(node))
        return `${v}[0]`;
    return v;
};
const parseExpressions = (expressions) => {
    if (expressions.length === 1 && ExpressionReturnsArray(expressions[0])) {
        return generate(expressions[0]);
    }
    return `[${parseExpressionList(expressions).join(', ')}]`;
};
const parseExpressionList = (expressions) => {
    return expressions.map((node, index, arr) => {
        const value = generate(node);
        if (ExpressionReturnsArray(node)) {
            return index === arr.length - 1 ? `...${value}` : `${value}[0]`;
        }
        return value;
    });
};
const parseAssignments = (node) => {
    const lines = [];
    const valFns = [];
    const useTempVar = node.variables.length > 1 && node.init.length > 0 && !node.init.every(isLiteral);
    for (let i = 0; i < node.variables.length; i++) {
        const K = node.variables[i];
        const V = node.init[i];
        const initStr = useTempVar ? `vars[${i}]` : V === undefined ? 'undefined' : expression(V);
        if (K.type === 'Identifier') {
            const setStr = node.type === 'LocalStatement' ? 'setLocal' : 'set';
            lines.push(`$${nodeToScope.get(K)}.${setStr}('${K.name}', ${initStr})`);
        }
        else {
            const name = generate(K);
            if (useTempVar) {
                lines.push(`vals[${valFns.length}](${initStr})`);
                valFns.push(name.setFn());
            }
            else {
                lines.push(name.set(initStr));
            }
        }
    }
    for (let i = node.variables.length; i < node.init.length; i++) {
        const init = node.init[i];
        if (isCallExpression(init)) {
            lines.push(generate(init));
        }
    }
    if (useTempVar) {
        lines.unshift(`vars = ${parseExpressions(node.init)}`);
        if (valFns.length > 0) {
            lines.unshift(`vals = [${valFns.join(', ')}]`);
        }
    }
    return lines.join(';\n');
};
const isCallExpression = (node) => {
    return node.type === 'CallExpression' || node.type === 'StringCallExpression' || node.type === 'TableCallExpression';
};
const ExpressionReturnsArray = (node) => {
    return isCallExpression(node) || node.type === 'VarargLiteral';
};
const isLiteral = (node) => {
    return (node.type === 'StringLiteral' ||
        node.type === 'NumericLiteral' ||
        node.type === 'BooleanLiteral' ||
        node.type === 'NilLiteral' ||
        node.type === 'TableConstructorExpression');
};
const checkGoto = (ast) => {
    const gotoInfo = [];
    let gotoScope = 0;
    const gotoScopeMap = new Map();
    const getNextGotoScope = (() => {
        let id = 0;
        return () => {
            id += 1;
            return id;
        };
    })();
    const check = (node) => {
        if (isBlock(node)) {
            createGotoScope();
            for (let i = 0; i < node.body.length; i++) {
                const n = node.body[i];
                switch (n.type) {
                    case 'LocalStatement': {
                        gotoInfo.push({
                            type: 'local',
                            name: n.variables[0].name,
                            scope: gotoScope
                        });
                        break;
                    }
                    case 'LabelStatement': {
                        if (gotoInfo.find(node => node.type === 'label' && node.name === n.label.name && node.scope === gotoScope)) {
                            throw new Error(`label '${n.label.name}' already defined`);
                        }
                        gotoInfo.push({
                            type: 'label',
                            name: n.label.name,
                            scope: gotoScope,
                            last: node.type !== 'RepeatStatement' &&
                                node.body.slice(i).every(n => n.type === 'LabelStatement')
                        });
                        break;
                    }
                    case 'GotoStatement': {
                        gotoInfo.push({
                            type: 'goto',
                            name: n.label.name,
                            scope: gotoScope
                        });
                        break;
                    }
                    case 'IfStatement': {
                        n.clauses.forEach(n => check(n));
                        break;
                    }
                    default: {
                        check(n);
                    }
                }
            }
            destroyGotoScope();
        }
    };
    check(ast);
    function createGotoScope() {
        const parent = gotoScope;
        gotoScope = getNextGotoScope();
        gotoScopeMap.set(gotoScope, parent);
    }
    function destroyGotoScope() {
        gotoScope = gotoScopeMap.get(gotoScope);
    }
    for (let i = 0; i < gotoInfo.length; i++) {
        const goto = gotoInfo[i];
        if (goto.type === 'goto') {
            const label = gotoInfo
                .filter(node => node.type === 'label' && node.name === goto.name && node.scope <= goto.scope)
                .sort((a, b) => Math.abs(goto.scope - a.scope) - Math.abs(goto.scope - b.scope))[0];
            if (!label) {
                throw new Error(`no visible label '${goto.name}' for <goto>`);
            }
            const labelI = gotoInfo.findIndex(n => n === label);
            if (labelI > i) {
                const locals = gotoInfo
                    .slice(i, labelI)
                    .filter(node => node.type === 'local' && node.scope === label.scope);
                if (!label.last && locals.length > 0) {
                    throw new Error(`<goto ${goto.name}> jumps into the scope of local '${locals[0].name}'`);
                }
            }
        }
    }
};
const visitNode = (node, visitProp, nextScope, isNewScope, nextGoto) => {
    const VP = (node, partOfBlock = true) => {
        if (!node)
            return;
        const S = partOfBlock === false && isNewScope ? scopeToParentScope.get(nextScope) : nextScope;
        if (Array.isArray(node)) {
            node.forEach(n => visitProp(n, S, nextGoto));
        }
        else {
            visitProp(node, S, nextGoto);
        }
    };
    switch (node.type) {
        case 'LocalStatement':
        case 'AssignmentStatement':
            VP(node.variables);
            VP(node.init);
            break;
        case 'UnaryExpression':
            VP(node.argument);
            break;
        case 'BinaryExpression':
        case 'LogicalExpression':
            VP(node.left);
            VP(node.right);
            break;
        case 'FunctionDeclaration':
            VP(node.identifier, false);
            VP(node.parameters);
            VP(node.body);
            break;
        case 'ForGenericStatement':
            VP(node.variables);
            VP(node.iterators, false);
            VP(node.body);
            break;
        case 'IfClause':
        case 'ElseifClause':
        case 'WhileStatement':
        case 'RepeatStatement':
            VP(node.condition, false);
        case 'Chunk':
        case 'ElseClause':
        case 'DoStatement':
            VP(node.body);
            break;
        case 'ForNumericStatement':
            VP(node.variable);
            VP(node.start, false);
            VP(node.end, false);
            VP(node.step, false);
            VP(node.body);
            break;
        case 'ReturnStatement':
            VP(node.arguments);
            break;
        case 'IfStatement':
            VP(node.clauses);
            break;
        case 'MemberExpression':
            VP(node.base);
            VP(node.identifier);
            break;
        case 'IndexExpression':
            VP(node.base);
            VP(node.index);
            break;
        case 'LabelStatement':
            VP(node.label);
            break;
        case 'CallStatement':
            VP(node.expression);
            break;
        case 'GotoStatement':
            VP(node.label);
            break;
        case 'TableConstructorExpression':
            VP(node.fields);
            break;
        case 'TableKey':
        case 'TableKeyString':
            VP(node.key);
        case 'TableValue':
            VP(node.value);
            break;
        case 'CallExpression':
            VP(node.base);
            VP(node.arguments);
            break;
        case 'TableCallExpression':
            VP(node.base);
            VP(node.arguments);
            break;
        case 'StringCallExpression':
            VP(node.base);
            VP(node.argument);
    }
};
const scopeToParentScope = new Map();
const nodeToScope = new Map();
const gotoToParentGoto = new Map();
const nodeToGoto = new Map();
const setExtraInfo = (ast) => {
    let scopeID = 0;
    let gotoID = 0;
    const visitProp = (node, prevScope, prevGoto) => {
        let nextScope = prevScope;
        let nextGoto = prevGoto;
        if (isBlock(node)) {
            if (node.body.findIndex(n => n.type === 'LocalStatement' || (n.type === 'FunctionDeclaration' && n.isLocal)) !== -1 ||
                (node.type === 'FunctionDeclaration' &&
                    (node.parameters.length > 0 || (node.identifier && node.identifier.type === 'MemberExpression'))) ||
                node.type === 'ForNumericStatement' ||
                node.type === 'ForGenericStatement') {
                scopeID += 1;
                nextScope = scopeID;
                nodeToScope.set(node, scopeID);
                scopeToParentScope.set(scopeID, prevScope);
            }
            if (node.body.findIndex(s => s.type === 'LabelStatement' || s.type === 'GotoStatement') !== -1) {
                nextGoto = gotoID;
                nodeToGoto.set(node, gotoID);
                if (node.type !== 'Chunk' && node.type !== 'FunctionDeclaration') {
                    gotoToParentGoto.set(gotoID, prevGoto);
                }
                gotoID += 1;
            }
        }
        else if (node.type === 'Identifier' || node.type === 'VarargLiteral') {
            nodeToScope.set(node, prevScope);
        }
        visitNode(node, visitProp, nextScope, prevScope !== nextScope, nextGoto);
    };
    visitProp(ast, scopeID, gotoID);
};
const parse = (data) => {
    const ast = luaparse__WEBPACK_IMPORTED_MODULE_0___default().parse(data.replace(/^#.*/, ''), {
        scope: false,
        comments: false,
        luaVersion: '5.3',
        encodingMode: 'x-user-defined'
    });
    checkGoto(ast);
    setExtraInfo(ast);
    return generate(ast).toString();
};

const ROSETTA_STONE = {
    '([^a-zA-Z0-9%(])-': '$1*?',
    '([^%])-([^a-zA-Z0-9?])': '$1*?$2',
    '([^%])\\.': '$1[\\s\\S]',
    '(.)-$': '$1*?',
    '%a': '[a-zA-Z]',
    '%A': '[^a-zA-Z]',
    '%c': '[\x00-\x1f]',
    '%C': '[^\x00-\x1f]',
    '%d': '\\d',
    '%D': '[^d]',
    '%l': '[a-z]',
    '%L': '[^a-z]',
    '%p': '[.,"\'?!;:#$%&()*+-/<>=@\\[\\]\\\\^_{}|~]',
    '%P': '[^.,"\'?!;:#$%&()*+-/<>=@\\[\\]\\\\^_{}|~]',
    '%s': '[ \\t\\n\\f\\v\\r]',
    '%S': '[^ \t\n\f\v\r]',
    '%u': '[A-Z]',
    '%U': '[^A-Z]',
    '%w': '[a-zA-Z0-9]',
    '%W': '[^a-zA-Z0-9]',
    '%x': '[a-fA-F0-9]',
    '%X': '[^a-fA-F0-9]',
    '%([^a-zA-Z])': '\\$1'
};
function translatePattern(pattern) {
    let tPattern = pattern.replace(/\\/g, '\\\\');
    for (const i in ROSETTA_STONE) {
        if (hasOwnProperty(ROSETTA_STONE, i)) {
            tPattern = tPattern.replace(new RegExp(i, 'g'), ROSETTA_STONE[i]);
        }
    }
    let nestingLevel = 0;
    for (let i = 0, l = tPattern.length; i < l; i++) {
        if (i && tPattern.substr(i - 1, 1) === '\\') {
            continue;
        }
        const character = tPattern.substr(i, 1);
        if (character === '[' || character === ']') {
            if (character === ']') {
                nestingLevel -= 1;
            }
            if (nestingLevel > 0) {
                tPattern = tPattern.substr(0, i) + tPattern.substr(i + 1);
                i -= 1;
                l -= 1;
            }
            if (character === '[') {
                nestingLevel += 1;
            }
        }
    }
    return tPattern;
}
function byte(s, i, j) {
    const S = coerceArgToString(s, 'byte', 1);
    const I = i === undefined ? 1 : coerceArgToNumber(i, 'byte', 2);
    const J = j === undefined ? I : coerceArgToNumber(j, 'byte', 3);
    return S.substring(I - 1, J)
        .split('')
        .map(c => c.charCodeAt(0));
}
function char(...bytes) {
    return bytes
        .map((b, i) => {
        const B = coerceArgToNumber(b, 'char', i);
        return String.fromCharCode(B);
    })
        .join('');
}
function find(s, pattern, init, plain) {
    const S = coerceArgToString(s, 'find', 1);
    const P = coerceArgToString(pattern, 'find', 2);
    const INIT = init === undefined ? 1 : coerceArgToNumber(init, 'find', 3);
    const PLAIN = plain === undefined ? false : coerceArgToNumber(plain, 'find', 4);
    if (!PLAIN) {
        const regex = new RegExp(translatePattern(P));
        const index = S.substr(INIT - 1).search(regex);
        if (index < 0)
            return;
        const match = S.substr(INIT - 1).match(regex);
        const result = [index + INIT, index + INIT + match[0].length - 1];
        match.shift();
        return [...result, ...match];
    }
    const index = S.indexOf(P, INIT - 1);
    return index === -1 ? undefined : [index + 1, index + P.length];
}
function format(formatstring, ...args) {
    const PATTERN = /%%|%([-+ #0]*)?(\d*)?(?:\.(\d*))?(.)/g;
    let i = -1;
    return formatstring.replace(PATTERN, (format, flags, width, precision, modifier) => {
        if (format === '%%')
            return '%';
        if (!modifier.match(/[AEGXacdefgioqsux]/)) {
            throw new LuaError(`invalid option '%${format}' to 'format'`);
        }
        if (flags && flags.length > 5) {
            throw new LuaError(`invalid format (repeated flags)`);
        }
        if (width && width.length > 2) {
            throw new LuaError(`invalid format (width too long)`);
        }
        if (precision && precision.length > 2) {
            throw new LuaError(`invalid format (precision too long)`);
        }
        i += 1;
        const arg = args[i];
        if (arg === undefined) {
            throw new LuaError(`bad argument #${i} to 'format' (no value)`);
        }
        if (/A|a|E|e|f|G|g/.test(modifier)) {
            return (0,printj__WEBPACK_IMPORTED_MODULE_1__.sprintf)(format, coerceArgToNumber(arg, 'format', i));
        }
        if (/c|d|i|o|u|X|x/.test(modifier)) {
            return (0,printj__WEBPACK_IMPORTED_MODULE_1__.sprintf)(format, coerceArgToNumber(arg, 'format', i));
        }
        if (modifier === 'q') {
            return `"${arg.replace(/([\n"])/g, '\\$1')}"`;
        }
        if (modifier === 's') {
            return (0,printj__WEBPACK_IMPORTED_MODULE_1__.sprintf)(format, tostring(arg));
        }
        return (0,printj__WEBPACK_IMPORTED_MODULE_1__.sprintf)(format, arg);
    });
}
function gmatch(s, pattern) {
    const S = coerceArgToString(s, 'gmatch', 1);
    const P = translatePattern(coerceArgToString(pattern, 'gmatch', 2));
    const reg = new RegExp(P, 'g');
    const matches = S.match(reg);
    return () => {
        const match = matches.shift();
        if (match === undefined)
            return [];
        const groups = new RegExp(P).exec(match);
        groups.shift();
        return groups.length ? groups : [match];
    };
}
function gsub(s, pattern, repl, n) {
    let S = coerceArgToString(s, 'gsub', 1);
    const N = n === undefined ? Infinity : coerceArgToNumber(n, 'gsub', 3);
    const P = translatePattern(coerceArgToString(pattern, 'gsub', 2));
    const REPL = (() => {
        if (typeof repl === 'function')
            return strs => {
                const ret = repl(strs[0])[0];
                return ret === undefined ? strs[0] : ret;
            };
        if (repl instanceof Table)
            return strs => repl.get(strs[0]).toString();
        return strs => `${repl}`.replace(/%([0-9])/g, (_, i) => strs[i]);
    })();
    let result = '';
    let count = 0;
    let match;
    let lastMatch;
    while (count < N && S && (match = S.match(P))) {
        const prefix = match[0].length > 0 ? S.substr(0, match.index) : lastMatch === undefined ? '' : S.substr(0, 1);
        lastMatch = match[0];
        result += `${prefix}${REPL(match)}`;
        S = S.substr(`${prefix}${lastMatch}`.length);
        count += 1;
    }
    return `${result}${S}`;
}
function len(s) {
    const str = coerceArgToString(s, 'len', 1);
    return str.length;
}
function lower(s) {
    const str = coerceArgToString(s, 'lower', 1);
    return str.toLowerCase();
}
function match(s, pattern, init = 0) {
    let str = coerceArgToString(s, 'match', 1);
    const patt = coerceArgToString(pattern, 'match', 2);
    const ini = coerceArgToNumber(init, 'match', 3);
    str = str.substr(ini);
    const matches = str.match(new RegExp(translatePattern(patt)));
    if (!matches) {
        return;
    }
    else if (!matches[1]) {
        return matches[0];
    }
    matches.shift();
    return matches;
}
function rep(s, n, sep) {
    const str = coerceArgToString(s, 'rep', 1);
    const num = coerceArgToNumber(n, 'rep', 2);
    const SEP = sep === undefined ? '' : coerceArgToString(sep, 'rep', 3);
    return Array(num)
        .fill(str)
        .join(SEP);
}
function reverse(s) {
    const str = coerceArgToString(s, 'reverse', 1);
    return str
        .split('')
        .reverse()
        .join('');
}
function sub(s, i = 1, j = -1) {
    const S = coerceArgToString(s, 'sub', 1);
    let start = posrelat(coerceArgToNumber(i, 'sub', 2), S.length);
    let end = posrelat(coerceArgToNumber(j, 'sub', 3), S.length);
    if (start < 1)
        start = 1;
    if (end > S.length)
        end = S.length;
    if (start <= end)
        return S.substr(start - 1, end - start + 1);
    return '';
}
function upper(s) {
    const S = coerceArgToString(s, 'upper', 1);
    return S.toUpperCase();
}
const libString = new Table({
    byte,
    char,
    find,
    format,
    gmatch,
    gsub,
    len,
    lower,
    match,
    rep,
    reverse,
    sub,
    upper
});
const metatable = new Table({ __index: libString });

const CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
function ipairsIterator(table, index) {
    if (index === undefined) {
        throw new LuaError('Bad argument #2 to ipairs() iterator');
    }
    const nextIndex = index + 1;
    const numValues = table.numValues;
    if (!numValues[nextIndex] || numValues[nextIndex] === undefined)
        return undefined;
    return [nextIndex, numValues[nextIndex]];
}
const _VERSION = 'Lua 5.3';
function assert(v, m) {
    if (coerceToBoolean(v))
        return [v, m];
    const msg = m === undefined ? 'Assertion failed!' : coerceArgToString(m, 'assert', 2);
    throw new LuaError(msg);
}
function collectgarbage() {
    return [];
}
function error(message) {
    const msg = coerceArgToString(message, 'error', 1);
    throw new LuaError(msg);
}
function getmetatable(table) {
    if (table instanceof Table && table.metatable) {
        const mm = table.metatable.rawget('__metatable');
        return mm ? mm : table.metatable;
    }
    if (typeof table === 'string') {
        return metatable;
    }
}
function ipairs(t) {
    const table = coerceArgToTable(t, 'ipairs', 1);
    const mm = table.getMetaMethod('__pairs') || table.getMetaMethod('__ipairs');
    return mm ? mm(table).slice(0, 3) : [ipairsIterator, table, 0];
}
function next(table, index) {
    const TABLE = coerceArgToTable(table, 'next', 1);
    let found = index === undefined;
    if (found || (typeof index === 'number' && index > 0)) {
        const numValues = TABLE.numValues;
        const keys = Object.keys(numValues);
        let i = 1;
        if (!found) {
            const I = keys.indexOf(`${index}`);
            if (I >= 0) {
                found = true;
                i += I;
            }
        }
        if (found) {
            for (i; keys[i] !== undefined; i++) {
                const key = Number(keys[i]);
                const value = numValues[key];
                if (value !== undefined)
                    return [key, value];
            }
        }
    }
    for (const i in TABLE.strValues) {
        if (hasOwnProperty(TABLE.strValues, i)) {
            if (!found) {
                if (i === index)
                    found = true;
            }
            else if (TABLE.strValues[i] !== undefined) {
                return [i, TABLE.strValues[i]];
            }
        }
    }
    for (const i in TABLE.keys) {
        if (hasOwnProperty(TABLE.keys, i)) {
            const key = TABLE.keys[i];
            if (!found) {
                if (key === index)
                    found = true;
            }
            else if (TABLE.values[i] !== undefined) {
                return [key, TABLE.values[i]];
            }
        }
    }
}
function pairs(t) {
    const table = coerceArgToTable(t, 'pairs', 1);
    const mm = table.getMetaMethod('__pairs');
    return mm ? mm(table).slice(0, 3) : [next, table, undefined];
}
function pcall(f, ...args) {
    if (typeof f !== 'function') {
        throw new LuaError('Attempt to call non-function');
    }
    try {
        return [true, ...f(...args)];
    }
    catch (e) {
        return [false, e && e.toString()];
    }
}
function rawequal(v1, v2) {
    return v1 === v2;
}
function rawget(table, index) {
    const TABLE = coerceArgToTable(table, 'rawget', 1);
    return TABLE.rawget(index);
}
function rawlen(v) {
    if (v instanceof Table)
        return v.getn();
    if (typeof v === 'string')
        return v.length;
    throw new LuaError('attempt to get length of an unsupported value');
}
function rawset(table, index, value) {
    const TABLE = coerceArgToTable(table, 'rawset', 1);
    if (index === undefined)
        throw new LuaError('table index is nil');
    TABLE.rawset(index, value);
    return TABLE;
}
function select(index, ...args) {
    if (index === '#') {
        return args.length;
    }
    if (typeof index === 'number') {
        const pos = posrelat(Math.trunc(index), args.length);
        return args.slice(pos - 1);
    }
    throw new LuaError(`bad argument #1 to 'select' (number expected, got ${type(index)})`);
}
function setmetatable(table, metatable) {
    const TABLE = coerceArgToTable(table, 'setmetatable', 1);
    if (TABLE.metatable && TABLE.metatable.rawget('__metatable')) {
        throw new LuaError('cannot change a protected metatable');
    }
    TABLE.metatable = metatable === null || metatable === undefined ? null : coerceArgToTable(metatable, 'setmetatable', 2);
    return TABLE;
}
function tonumber(e, base) {
    const E = coerceToString(e).trim();
    const BASE = base === undefined ? 10 : coerceArgToNumber(base, 'tonumber', 2);
    if (BASE !== 10 && E === 'nil') {
        throw new LuaError("bad argument #1 to 'tonumber' (string expected, got nil)");
    }
    if (BASE < 2 || BASE > 36) {
        throw new LuaError(`bad argument #2 to 'tonumber' (base out of range)`);
    }
    if (E === '')
        return;
    if (BASE === 10)
        return coerceToNumber(E);
    const pattern = new RegExp(`^${BASE === 16 ? '(0x)?' : ''}[${CHARS.substr(0, BASE)}]*$`, 'gi');
    if (!pattern.test(E))
        return;
    return parseInt(E, BASE);
}
function xpcall(f, msgh, ...args) {
    if (typeof f !== 'function' || typeof msgh !== 'function') {
        throw new LuaError('Attempt to call non-function');
    }
    try {
        return [true, ...f(...args)];
    }
    catch (e) {
        return [false, msgh(e)[0]];
    }
}
function createG(cfg, execChunk) {
    function print(...args) {
        const output = args.map(arg => tostring(arg)).join('\t');
        cfg.stdout(output);
    }
    function load(chunk, _chunkname, _mode, env) {
        let C = '';
        if (chunk instanceof Function) {
            let ret = ' ';
            while (ret !== '' && ret !== undefined) {
                C += ret;
                ret = chunk()[0];
            }
        }
        else {
            C = coerceArgToString(chunk, 'load', 1);
        }
        let parsed;
        try {
            parsed = parse(C);
        }
        catch (e) {
            return [undefined, e.message];
        }
        return () => execChunk(env || _G, parsed);
    }
    function dofile(filename) {
        const res = loadfile(filename);
        if (Array.isArray(res) && res[0] === undefined) {
            throw new LuaError(res[1]);
        }
        const exec = res;
        return exec();
    }
    function loadfile(filename, mode, env) {
        const FILENAME = filename === undefined ? cfg.stdin : coerceArgToString(filename, 'loadfile', 1);
        if (!cfg.fileExists) {
            throw new LuaError('loadfile requires the config.fileExists function');
        }
        if (!cfg.fileExists(FILENAME))
            return [undefined, 'file not found'];
        if (!cfg.loadFile) {
            throw new LuaError('loadfile requires the config.loadFile function');
        }
        return load(cfg.loadFile(FILENAME), FILENAME, mode, env);
    }
    const _G = new Table({
        _VERSION,
        assert,
        dofile,
        collectgarbage,
        error,
        getmetatable,
        ipairs,
        load,
        loadfile,
        next,
        pairs,
        pcall,
        print,
        rawequal,
        rawget,
        rawlen,
        rawset,
        select,
        setmetatable,
        tonumber,
        tostring,
        type,
        xpcall
    });
    return _G;
}

const binaryArithmetic = (left, right, metaMethodName, callback) => {
    const mm = (left instanceof Table && left.getMetaMethod(metaMethodName)) ||
        (right instanceof Table && right.getMetaMethod(metaMethodName));
    if (mm)
        return mm(left, right)[0];
    const L = coerceToNumber(left, 'attempt to perform arithmetic on a %type value');
    const R = coerceToNumber(right, 'attempt to perform arithmetic on a %type value');
    return callback(L, R);
};
const binaryBooleanArithmetic = (left, right, metaMethodName, callback) => {
    if ((typeof left === 'string' && typeof right === 'string') ||
        (typeof left === 'number' && typeof right === 'number')) {
        return callback(left, right);
    }
    return binaryArithmetic(left, right, metaMethodName, callback);
};
const bool = (value) => coerceToBoolean(value);
const and = (l, r) => coerceToBoolean(l) ? r : l;
const or = (l, r) => coerceToBoolean(l) ? l : r;
const not = (value) => !bool(value);
const unm = (value) => {
    const mm = value instanceof Table && value.getMetaMethod('__unm');
    if (mm)
        return mm(value)[0];
    return -1 * coerceToNumber(value, 'attempt to perform arithmetic on a %type value');
};
const bnot = (value) => {
    const mm = value instanceof Table && value.getMetaMethod('__bnot');
    if (mm)
        return mm(value)[0];
    return ~coerceToNumber(value, 'attempt to perform arithmetic on a %type value');
};
const len$1 = (value) => {
    if (value instanceof Table) {
        const mm = value.getMetaMethod('__len');
        if (mm)
            return mm(value)[0];
        return value.getn();
    }
    if (typeof value === 'string')
        return value.length;
    throw new LuaError('attempt to get length of an unsupported value');
};
const add = (left, right) => binaryArithmetic(left, right, '__add', (l, r) => l + r);
const sub$1 = (left, right) => binaryArithmetic(left, right, '__sub', (l, r) => l - r);
const mul = (left, right) => binaryArithmetic(left, right, '__mul', (l, r) => l * r);
const mod = (left, right) => binaryArithmetic(left, right, '__mod', (l, r) => {
    if (r === 0 || r === -Infinity || r === Infinity || isNaN(l) || isNaN(r))
        return NaN;
    const absR = Math.abs(r);
    let result = Math.abs(l) % absR;
    if (l * r < 0)
        result = absR - result;
    if (r < 0)
        result *= -1;
    return result;
});
const pow = (left, right) => binaryArithmetic(left, right, '__pow', Math.pow);
const div = (left, right) => binaryArithmetic(left, right, '__div', (l, r) => {
    if (r === undefined)
        throw new LuaError('attempt to perform arithmetic on a nil value');
    return l / r;
});
const idiv = (left, right) => binaryArithmetic(left, right, '__idiv', (l, r) => {
    if (r === undefined)
        throw new LuaError('attempt to perform arithmetic on a nil value');
    return Math.floor(l / r);
});
const band = (left, right) => binaryArithmetic(left, right, '__band', (l, r) => l & r);
const bor = (left, right) => binaryArithmetic(left, right, '__bor', (l, r) => l | r);
const bxor = (left, right) => binaryArithmetic(left, right, '__bxor', (l, r) => l ^ r);
const shl = (left, right) => binaryArithmetic(left, right, '__shl', (l, r) => l << r);
const shr = (left, right) => binaryArithmetic(left, right, '__shr', (l, r) => l >> r);
const concat = (left, right) => {
    const mm = (left instanceof Table && left.getMetaMethod('__concat')) ||
        (right instanceof Table && right.getMetaMethod('__concat'));
    if (mm)
        return mm(left, right)[0];
    const L = coerceToString(left, 'attempt to concatenate a %type value');
    const R = coerceToString(right, 'attempt to concatenate a %type value');
    return `${L}${R}`;
};
const neq = (left, right) => !eq(left, right);
const eq = (left, right) => {
    const mm = right !== left &&
        left instanceof Table &&
        right instanceof Table &&
        left.metatable === right.metatable &&
        left.getMetaMethod('__eq');
    if (mm)
        return !!mm(left, right)[0];
    return left === right;
};
const lt = (left, right) => binaryBooleanArithmetic(left, right, '__lt', (l, r) => l < r);
const le = (left, right) => binaryBooleanArithmetic(left, right, '__le', (l, r) => l <= r);
const gt = (left, right) => !le(left, right);
const ge = (left, right) => !lt(left, right);
const operators = {
    bool,
    and,
    or,
    not,
    unm,
    bnot,
    len: len$1,
    add,
    sub: sub$1,
    mul,
    mod,
    pow,
    div,
    idiv,
    band,
    bor,
    bxor,
    shl,
    shr,
    concat,
    neq,
    eq,
    lt,
    le,
    gt,
    ge,
};

const maxinteger = Number.MAX_SAFE_INTEGER;
const mininteger = Number.MIN_SAFE_INTEGER;
const huge = Infinity;
const pi = Math.PI;
let randomSeed = 1;
function getRandom() {
    randomSeed = (16807 * randomSeed) % 2147483647;
    return randomSeed / 2147483647;
}
function abs(x) {
    const X = coerceArgToNumber(x, 'abs', 1);
    return Math.abs(X);
}
function acos(x) {
    const X = coerceArgToNumber(x, 'acos', 1);
    return Math.acos(X);
}
function asin(x) {
    const X = coerceArgToNumber(x, 'asin', 1);
    return Math.asin(X);
}
function atan(y, x) {
    const Y = coerceArgToNumber(y, 'atan', 1);
    const X = x === undefined ? 1 : coerceArgToNumber(x, 'atan', 2);
    return Math.atan2(Y, X);
}
function atan2(y, x) {
    return atan(y, x);
}
function ceil(x) {
    const X = coerceArgToNumber(x, 'ceil', 1);
    return Math.ceil(X);
}
function cos(x) {
    const X = coerceArgToNumber(x, 'cos', 1);
    return Math.cos(X);
}
function cosh(x) {
    const X = coerceArgToNumber(x, 'cosh', 1);
    return (exp(X) + exp(-X)) / 2;
}
function deg(x) {
    const X = coerceArgToNumber(x, 'deg', 1);
    return (X * 180) / Math.PI;
}
function exp(x) {
    const X = coerceArgToNumber(x, 'exp', 1);
    return Math.exp(X);
}
function floor(x) {
    const X = coerceArgToNumber(x, 'floor', 1);
    return Math.floor(X);
}
function fmod(x, y) {
    const X = coerceArgToNumber(x, 'fmod', 1);
    const Y = coerceArgToNumber(y, 'fmod', 2);
    return X % Y;
}
function frexp(x) {
    let X = coerceArgToNumber(x, 'frexp', 1);
    if (X === 0) {
        return [0, 0];
    }
    const delta = X > 0 ? 1 : -1;
    X *= delta;
    const exponent = Math.floor(Math.log(X) / Math.log(2)) + 1;
    const mantissa = X / Math.pow(2, exponent);
    return [mantissa * delta, exponent];
}
function ldexp(m, e) {
    const M = coerceArgToNumber(m, 'ldexp', 1);
    const E = coerceArgToNumber(e, 'ldexp', 2);
    return M * Math.pow(2, E);
}
function log(x, base) {
    const X = coerceArgToNumber(x, 'log', 1);
    if (base === undefined) {
        return Math.log(X);
    }
    else {
        const B = coerceArgToNumber(base, 'log', 2);
        return Math.log(X) / Math.log(B);
    }
}
function log10(x) {
    const X = coerceArgToNumber(x, 'log10', 1);
    return Math.log(X) / Math.log(10);
}
function max(...args) {
    const ARGS = args.map((n, i) => coerceArgToNumber(n, 'max', i + 1));
    return Math.max(...ARGS);
}
function min(...args) {
    const ARGS = args.map((n, i) => coerceArgToNumber(n, 'min', i + 1));
    return Math.min(...ARGS);
}
function modf(x) {
    const X = coerceArgToNumber(x, 'modf', 1);
    const intValue = Math.floor(X);
    const mantissa = X - intValue;
    return [intValue, mantissa];
}
function pow$1(x, y) {
    const X = coerceArgToNumber(x, 'pow', 1);
    const Y = coerceArgToNumber(y, 'pow', 2);
    return Math.pow(X, Y);
}
function rad(x) {
    const X = coerceArgToNumber(x, 'rad', 1);
    return (Math.PI / 180) * X;
}
function random(min, max) {
    if (min === undefined && max === undefined)
        return getRandom();
    const firstArg = coerceArgToNumber(min, 'random', 1);
    const MIN = max !== undefined ? firstArg : 1;
    const MAX = max !== undefined ? coerceArgToNumber(max, 'random', 2) : firstArg;
    if (MIN > MAX)
        throw new Error("bad argument #2 to 'random' (interval is empty)");
    return Math.floor(getRandom() * (MAX - MIN + 1) + MIN);
}
function randomseed(x) {
    randomSeed = coerceArgToNumber(x, 'randomseed', 1);
}
function sin(x) {
    const X = coerceArgToNumber(x, 'sin', 1);
    return Math.sin(X);
}
function sinh(x) {
    const X = coerceArgToNumber(x, 'sinh', 1);
    return (exp(X) - exp(-X)) / 2;
}
function sqrt(x) {
    const X = coerceArgToNumber(x, 'sqrt', 1);
    return Math.sqrt(X);
}
function tan(x) {
    const X = coerceArgToNumber(x, 'tan', 1);
    return Math.tan(X);
}
function tanh(x) {
    const X = coerceArgToNumber(x, 'tanh', 1);
    return (exp(X) - exp(-X)) / (exp(X) + exp(-X));
}
function tointeger(x) {
    const X = coerceToNumber(x);
    if (X === undefined)
        return undefined;
    return Math.floor(X);
}
function type$1(x) {
    const X = coerceToNumber(x);
    if (X === undefined)
        return undefined;
    if (tointeger(X) === X)
        return 'integer';
    return 'float';
}
function ult(m, n) {
    const M = coerceArgToNumber(m, 'ult', 1);
    const N = coerceArgToNumber(n, 'ult', 2);
    const toUnsigned = (n) => n >>> 0;
    return toUnsigned(M) < toUnsigned(N);
}
const libMath = new Table({
    abs,
    acos,
    asin,
    atan,
    atan2,
    ceil,
    cos,
    cosh,
    deg,
    exp,
    floor,
    fmod,
    frexp,
    huge,
    ldexp,
    log,
    log10,
    max,
    min,
    maxinteger,
    mininteger,
    modf,
    pi,
    pow: pow$1,
    rad,
    random,
    randomseed,
    sin,
    sinh,
    sqrt,
    tan,
    tanh,
    tointeger,
    type: type$1,
    ult
});

function getn(table) {
    const TABLE = coerceArgToTable(table, 'getn', 1);
    return TABLE.getn();
}
function concat$1(table, sep = '', i = 1, j) {
    const TABLE = coerceArgToTable(table, 'concat', 1);
    const SEP = coerceArgToString(sep, 'concat', 2);
    const I = coerceArgToNumber(i, 'concat', 3);
    const J = j === undefined ? maxn(TABLE) : coerceArgToNumber(j, 'concat', 4);
    return []
        .concat(TABLE.numValues)
        .splice(I, J - I + 1)
        .join(SEP);
}
function insert(table, pos, value) {
    const TABLE = coerceArgToTable(table, 'insert', 1);
    const POS = value === undefined ? TABLE.numValues.length : coerceArgToNumber(pos, 'insert', 2);
    const VALUE = value === undefined ? pos : value;
    TABLE.numValues.splice(POS, 0, undefined);
    TABLE.set(POS, VALUE);
}
function maxn(table) {
    const TABLE = coerceArgToTable(table, 'maxn', 1);
    return TABLE.numValues.length - 1;
}
function move(a1, f, e, t, a2) {
    const A1 = coerceArgToTable(a1, 'move', 1);
    const F = coerceArgToNumber(f, 'move', 2);
    const E = coerceArgToNumber(e, 'move', 3);
    const T = coerceArgToNumber(t, 'move', 4);
    const A2 = a2 === undefined ? A1 : coerceArgToTable(a2, 'move', 5);
    if (E >= F) {
        if (F <= 0 && E >= Number.MAX_SAFE_INTEGER + F)
            throw new LuaError('too many elements to move');
        const n = E - F + 1;
        if (T > Number.MAX_SAFE_INTEGER - n + 1)
            throw new LuaError('destination wrap around');
        if (T > E || T <= F || A2 !== A1) {
            for (let i = 0; i < n; i++) {
                const v = A1.get(F + i);
                A2.set(T + i, v);
            }
        }
        else {
            for (let i = n - 1; i >= 0; i--) {
                const v = A1.get(F + i);
                A2.set(T + i, v);
            }
        }
    }
    return A2;
}
function pack(...args) {
    const table = new Table(args);
    table.rawset('n', args.length);
    return table;
}
function remove(table, pos) {
    const TABLE = coerceArgToTable(table, 'remove', 1);
    const max = TABLE.getn();
    const POS = pos === undefined ? max : coerceArgToNumber(pos, 'remove', 2);
    if (POS > max || POS < 0) {
        return;
    }
    const vals = TABLE.numValues;
    const result = vals.splice(POS, 1)[0];
    let i = POS;
    while (i < max && vals[i] === undefined) {
        delete vals[i];
        i += 1;
    }
    return result;
}
function sort(table, comp) {
    const TABLE = coerceArgToTable(table, 'sort', 1);
    let sortFunc;
    if (comp) {
        const COMP = coerceArgToFunction(comp, 'sort', 2);
        sortFunc = (a, b) => (coerceToBoolean(COMP(a, b)[0]) ? -1 : 1);
    }
    else {
        sortFunc = (a, b) => (a < b ? -1 : 1);
    }
    const arr = TABLE.numValues;
    arr.shift();
    arr.sort(sortFunc).unshift(undefined);
}
function unpack(table, i, j) {
    const TABLE = coerceArgToTable(table, 'unpack', 1);
    const I = i === undefined ? 1 : coerceArgToNumber(i, 'unpack', 2);
    const J = j === undefined ? TABLE.getn() : coerceArgToNumber(j, 'unpack', 3);
    return TABLE.numValues.slice(I, J + 1);
}
const libTable = new Table({
    getn,
    concat: concat$1,
    insert,
    maxn,
    move,
    pack,
    remove,
    sort,
    unpack
});

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];
const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const DATE_FORMAT_HANDLERS = {
    '%': () => '%',
    Y: (date, utc) => `${utc ? date.getUTCFullYear() : date.getFullYear()}`,
    y: (date, utc) => DATE_FORMAT_HANDLERS.Y(date, utc).substr(-2),
    b: (date, utc) => DATE_FORMAT_HANDLERS.B(date, utc).substr(0, 3),
    B: (date, utc) => MONTHS[utc ? date.getUTCMonth() : date.getMonth()],
    m: (date, utc) => `0${(utc ? date.getUTCMonth() : date.getMonth()) + 1}`.substr(-2),
    U: (date, utc) => getWeekOfYear(date, 0, utc),
    W: (date, utc) => getWeekOfYear(date, 1, utc),
    j: (date, utc) => {
        let result = utc ? date.getUTCDate() : date.getDate();
        const month = utc ? date.getUTCMonth() : date.getMonth();
        const year = utc ? date.getUTCFullYear() : date.getFullYear();
        result += DAYS_IN_MONTH.slice(0, month).reduce((sum, n) => sum + n, 0);
        if (month > 1 && year % 4 === 0) {
            result += 1;
        }
        return `00${result}`.substr(-3);
    },
    d: (date, utc) => `0${utc ? date.getUTCDate() : date.getDate()}`.substr(-2),
    a: (date, utc) => DATE_FORMAT_HANDLERS.A(date, utc).substr(0, 3),
    A: (date, utc) => DAYS[utc ? date.getUTCDay() : date.getDay()],
    w: (date, utc) => `${utc ? date.getUTCDay() : date.getDay()}`,
    H: (date, utc) => `0${utc ? date.getUTCHours() : date.getHours()}`.substr(-2),
    I: (date, utc) => `0${(utc ? date.getUTCHours() : date.getHours()) % 12 || 12}`.substr(-2),
    M: (date, utc) => `0${utc ? date.getUTCMinutes() : date.getMinutes()}`.substr(-2),
    S: (date, utc) => `0${utc ? date.getUTCSeconds() : date.getSeconds()}`.substr(-2),
    c: (date, utc) => date.toLocaleString(undefined, utc ? { timeZone: 'UTC' } : undefined),
    x: (date, utc) => {
        const m = DATE_FORMAT_HANDLERS.m(date, utc);
        const d = DATE_FORMAT_HANDLERS.d(date, utc);
        const y = DATE_FORMAT_HANDLERS.y(date, utc);
        return `${m}/${d}/${y}`;
    },
    X: (date, utc) => {
        const h = DATE_FORMAT_HANDLERS.H(date, utc);
        const m = DATE_FORMAT_HANDLERS.M(date, utc);
        const s = DATE_FORMAT_HANDLERS.S(date, utc);
        return `${h}:${m}:${s}`;
    },
    p: (date, utc) => ((utc ? date.getUTCHours() : date.getHours()) < 12 ? 'AM' : 'PM'),
    Z: (date, utc) => {
        if (utc)
            return 'UTC';
        const match = date.toString().match(/[A-Z][A-Z][A-Z]/);
        return match ? match[0] : '';
    }
};
function isDST(date) {
    const year = date.getFullYear();
    const jan = new Date(year, 0);
    return date.getTimezoneOffset() !== jan.getTimezoneOffset();
}
function getWeekOfYear(date, firstDay, utc) {
    const dayOfYear = parseInt(DATE_FORMAT_HANDLERS.j(date, utc), 10);
    const jan1 = new Date(date.getFullYear(), 0, 1, 12);
    const offset = (8 - (utc ? jan1.getUTCDay() : jan1.getDay()) + firstDay) % 7;
    return `0${Math.floor((dayOfYear - offset) / 7) + 1}`.substr(-2);
}
function date(input = '%c', time) {
    const utc = input.substr(0, 1) === '!';
    const string = utc ? input.substr(1) : input;
    const date = new Date();
    if (time) {
        date.setTime(time * 1000);
    }
    if (string === '*t') {
        return new Table({
            year: parseInt(DATE_FORMAT_HANDLERS.Y(date, utc), 10),
            month: parseInt(DATE_FORMAT_HANDLERS.m(date, utc), 10),
            day: parseInt(DATE_FORMAT_HANDLERS.d(date, utc), 10),
            hour: parseInt(DATE_FORMAT_HANDLERS.H(date, utc), 10),
            min: parseInt(DATE_FORMAT_HANDLERS.M(date, utc), 10),
            sec: parseInt(DATE_FORMAT_HANDLERS.S(date, utc), 10),
            wday: parseInt(DATE_FORMAT_HANDLERS.w(date, utc), 10) + 1,
            yday: parseInt(DATE_FORMAT_HANDLERS.j(date, utc), 10),
            isdst: isDST(date)
        });
    }
    return string.replace(/%[%YybBmUWjdaAwHIMScxXpZ]/g, f => DATE_FORMAT_HANDLERS[f[1]](date, utc));
}
function setlocale(locale = 'C') {
    if (locale === 'C')
        return 'C';
}
function time(table) {
    let now = Math.round(Date.now() / 1000);
    if (!table)
        return now;
    const year = table.rawget('year');
    const month = table.rawget('month');
    const day = table.rawget('day');
    const hour = table.rawget('hour') || 12;
    const min = table.rawget('min');
    const sec = table.rawget('sec');
    if (year)
        now += year * 31557600;
    if (month)
        now += month * 2629800;
    if (day)
        now += day * 86400;
    if (hour)
        now += hour * 3600;
    if (min)
        now += min * 60;
    if (sec)
        now += sec;
    return now;
}
function difftime(t2, t1) {
    const T2 = coerceArgToNumber(t2, 'difftime', 1);
    const T1 = coerceArgToNumber(t1, 'difftime', 2);
    return T2 - T1;
}
const getLibOS = (cfg) => {
    function exit(code) {
        if (!cfg.osExit)
            throw new LuaError('os.exit requires the config.osExit function');
        let CODE = 0;
        if (typeof code === 'boolean' && code === false)
            CODE = 1;
        else if (typeof code === 'number')
            CODE = code;
        cfg.osExit(CODE);
    }
    return new Table({
        date,
        exit,
        setlocale,
        time,
        difftime
    });
};

const getLibPackage = (execModule, cfg) => {
    const LUA_DIRSEP = '/';
    const LUA_PATH_SEP = ';';
    const LUA_PATH_MARK = '?';
    const LUA_EXEC_DIR = '!';
    const LUA_IGMARK = '-';
    const LUA_PATH = cfg.LUA_PATH;
    const config = [LUA_DIRSEP, LUA_PATH_SEP, LUA_PATH_MARK, LUA_EXEC_DIR, LUA_IGMARK].join('\n');
    const loaded = new Table();
    const preload = new Table();
    const searchpath = (name, path, sep, rep) => {
        if (!cfg.fileExists) {
            throw new LuaError('package.searchpath requires the config.fileExists function');
        }
        let NAME = coerceArgToString(name, 'searchpath', 1);
        const PATH = coerceArgToString(path, 'searchpath', 2);
        const SEP = sep === undefined ? '.' : coerceArgToString(sep, 'searchpath', 3);
        const REP = rep === undefined ? '/' : coerceArgToString(rep, 'searchpath', 4);
        NAME = NAME.replace(SEP, REP);
        const paths = PATH.split(';').map(template => template.replace('?', NAME));
        for (const path of paths) {
            if (cfg.fileExists(path))
                return path;
        }
        return [undefined, `The following files don't exist: ${paths.join(' ')}`];
    };
    const searchers = new Table([
        (moduleName) => {
            const res = preload.rawget(moduleName);
            if (res === undefined) {
                return [undefined];
            }
            return [res];
        },
        (moduleName) => {
            const res = searchpath(moduleName, libPackage.rawget('path'));
            if (Array.isArray(res) && res[0] === undefined) {
                return [res[1]];
            }
            if (!cfg.loadFile) {
                throw new LuaError('package.searchers requires the config.loadFile function');
            }
            return [(moduleName, path) => execModule(cfg.loadFile(path), moduleName), res];
        }
    ]);
    function _require(modname) {
        const MODNAME = coerceArgToString(modname, 'require', 1);
        const module = loaded.rawget(MODNAME);
        if (module)
            return module;
        const searcherFns = searchers.numValues.filter(fn => !!fn);
        for (const searcher of searcherFns) {
            const res = searcher(MODNAME);
            if (res[0] !== undefined && typeof res[0] !== 'string') {
                const loader = res[0];
                const result = loader(MODNAME, res[1]);
                const module = result === undefined ? true : result;
                loaded.rawset(MODNAME, module);
                return module;
            }
        }
        throw new LuaError(`Module '${MODNAME}' not found!`);
    }
    const libPackage = new Table({
        path: LUA_PATH,
        config,
        loaded,
        preload,
        searchers,
        searchpath
    });
    return { libPackage, _require };
};

const call = (f, ...args) => {
    if (f instanceof Function)
        return ensureArray(f(...args));
    const mm = f instanceof Table && f.getMetaMethod('__call');
    if (mm)
        return ensureArray(mm(f, ...args));
    throw new LuaError(`attempt to call an uncallable type`);
};
const stringTable = new Table();
stringTable.metatable = metatable;
const get = (t, v) => {
    if (t instanceof Table)
        return t.get(v);
    if (typeof t === 'string')
        return stringTable.get(v);
    throw new LuaError(`no table or metatable found for given type`);
};
const execChunk = (_G, chunk, chunkName) => {
    const exec = new Function('__lua', chunk);
    const globalScope = new Scope(_G.strValues).extend();
    if (chunkName)
        globalScope.setVarargs([chunkName]);
    const res = exec(Object.assign(Object.assign({ globalScope }, operators), { Table,
        call,
        get }));
    return res === undefined ? [undefined] : res;
};
function createEnv(config = {}) {
    const cfg = Object.assign({ LUA_PATH: './?.lua', stdin: '', stdout: console.log }, config);
    const _G = createG(cfg, execChunk);
    const { libPackage, _require } = getLibPackage((content, moduleName) => execChunk(_G, parse(content), moduleName)[0], cfg);
    const loaded = libPackage.get('loaded');
    const loadLib = (name, value) => {
        _G.rawset(name, value);
        loaded.rawset(name, value);
    };
    loadLib('_G', _G);
    loadLib('package', libPackage);
    loadLib('math', libMath);
    loadLib('table', libTable);
    loadLib('string', libString);
    loadLib('os', getLibOS(cfg));
    _G.rawset('require', _require);
    const parse$1 = (code) => {
        const script = parse(code);
        return {
            exec: () => execChunk(_G, script)[0]
        };
    };
    const parseFile = (filename) => {
        if (!cfg.fileExists)
            throw new LuaError('parseFile requires the config.fileExists function');
        if (!cfg.loadFile)
            throw new LuaError('parseFile requires the config.loadFile function');
        if (!cfg.fileExists(filename))
            throw new LuaError('file not found');
        return parse$1(cfg.loadFile(filename));
    };
    return {
        parse: parse$1,
        parseFile,
        loadLib
    };
}


//# sourceMappingURL=lua-in-js.es.js.map


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

/* module decorator */ module = __webpack_require__.nmd(module);
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* global exports:true, module:true, require:true, define:true, global:true */

(function (root, name, factory) {
  'use strict';

  // Used to determine if values are of the language type `Object`
  var objectTypes = {
        'function': true
      , 'object': true
    }
    // Detect free variable `exports`
    , freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports
    // Detect free variable `module`
    , freeModule = objectTypes["object"] && module && !module.nodeType && module
    // Detect free variable `global`, from Node.js or Browserified code, and
    // use it as `window`
    , freeGlobal = freeExports && freeModule && typeof __webpack_require__.g === 'object' && __webpack_require__.g
    // Detect the popular CommonJS extension `module.exports`
    , moduleExports = freeModule && freeModule.exports === freeExports && freeExports;

  /* istanbul ignore else */
  if (freeGlobal && (freeGlobal.global === freeGlobal ||
                     /* istanbul ignore next */ freeGlobal.window === freeGlobal ||
                     /* istanbul ignore next */ freeGlobal.self === freeGlobal)) {
    root = freeGlobal;
  }

  // Some AMD build optimizers, like r.js, check for specific condition
  // patterns like the following:
  /* istanbul ignore if */
  if (true) {
    // defined as an anonymous module.
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    // In case the source has been processed and wrapped in a define module use
    // the supplied `exports` object.
    if (freeExports && moduleExports) factory(freeModule.exports);
  }
  // check for `exports` after `define` in case a build optimizer adds an
  // `exports` object
  else /* istanbul ignore else */ {}
}(this, 'luaparse', function (exports) {
  'use strict';

  exports.version = "0.3.1";

  var input, options, length, features, encodingMode;

  // Options can be set either globally on the parser object through
  // defaultOptions, or during the parse call.
  var defaultOptions = exports.defaultOptions = {
    // Explicitly tell the parser when the input ends.
      wait: false
    // Store comments as an array in the chunk object.
    , comments: true
    // Track identifier scopes by adding an isLocal attribute to each
    // identifier-node.
    , scope: false
    // Store location information on each syntax node as
    // `loc: { start: { line, column }, end: { line, column } }`.
    , locations: false
    // Store the start and end character locations on each syntax node as
    // `range: [start, end]`.
    , ranges: false
    // A callback which will be invoked when a syntax node has been completed.
    // The node which has been created will be passed as the only parameter.
    , onCreateNode: null
    // A callback which will be invoked when a new scope is created.
    , onCreateScope: null
    // A callback which will be invoked when the current scope is destroyed.
    , onDestroyScope: null
    // A callback which will be invoked when a local variable is declared in the current scope.
    // The variable's name will be passed as the only parameter
    , onLocalDeclaration: null
    // The version of Lua targeted by the parser (string; allowed values are
    // '5.1', '5.2', '5.3').
    , luaVersion: '5.1'
    // Encoding mode: how to interpret code units higher than U+007F in input
    , encodingMode: 'none'
  };

  function encodeUTF8(codepoint, highMask) {
    highMask = highMask || 0;

    if (codepoint < 0x80) {
      return String.fromCharCode(codepoint);
    } else if (codepoint < 0x800) {
      return String.fromCharCode(
        highMask | 0xc0 |  (codepoint >>  6)        ,
        highMask | 0x80 | ( codepoint        & 0x3f)
      );
    } else if (codepoint < 0x10000) {
      return String.fromCharCode(
        highMask | 0xe0 |  (codepoint >> 12)        ,
        highMask | 0x80 | ((codepoint >>  6) & 0x3f),
        highMask | 0x80 | ( codepoint        & 0x3f)
      );
    } else /* istanbul ignore else */ if (codepoint < 0x110000) {
      return String.fromCharCode(
        highMask | 0xf0 |  (codepoint >> 18)        ,
        highMask | 0x80 | ((codepoint >> 12) & 0x3f),
        highMask | 0x80 | ((codepoint >>  6) & 0x3f),
        highMask | 0x80 | ( codepoint        & 0x3f)
      );
    } else {
      // TODO: Lua 5.4 allows up to six-byte sequences, as in UTF-8:1993
      return null;
    }
  }

  function toHex(num, digits) {
    var result = num.toString(16);
    while (result.length < digits)
      result = '0' + result;
    return result;
  }

  function checkChars(rx) {
    return function (s) {
      var m = rx.exec(s);
      if (!m)
        return s;
      raise(null, errors.invalidCodeUnit, toHex(m[0].charCodeAt(0), 4).toUpperCase());
    };
  }

  var encodingModes = {
    // `pseudo-latin1` encoding mode: assume the input was decoded with the latin1 encoding
    // WARNING: latin1 does **NOT** mean cp1252 here like in the bone-headed WHATWG standard;
    // it means true ISO/IEC 8859-1 identity-mapped to Basic Latin and Latin-1 Supplement blocks
    'pseudo-latin1': {
      fixup: checkChars(/[^\x00-\xff]/),
      encodeByte: function (value) {
        if (value === null)
          return '';
        return String.fromCharCode(value);
      },
      encodeUTF8: function (codepoint) {
        return encodeUTF8(codepoint);
      },
    },

    // `x-user-defined` encoding mode: assume the input was decoded with the WHATWG `x-user-defined` encoding
    'x-user-defined': {
      fixup: checkChars(/[^\x00-\x7f\uf780-\uf7ff]/),
      encodeByte: function (value) {
        if (value === null)
          return '';
        if (value >= 0x80)
          return String.fromCharCode(value | 0xf700);
        return String.fromCharCode(value);
      },
      encodeUTF8: function (codepoint) {
        return encodeUTF8(codepoint, 0xf700);
      }
    },

    // `none` encoding mode: disregard intrepretation of string literals, leave identifiers as-is
    'none': {
      discardStrings: true,
      fixup: function (s) {
        return s;
      },
      encodeByte: function (value) {
        return '';
      },
      encodeUTF8: function (codepoint) {
        return '';
      }
    }
  };

  // The available tokens expressed as enum flags so they can be checked with
  // bitwise operations.

  var EOF = 1, StringLiteral = 2, Keyword = 4, Identifier = 8
    , NumericLiteral = 16, Punctuator = 32, BooleanLiteral = 64
    , NilLiteral = 128, VarargLiteral = 256;

  exports.tokenTypes = { EOF: EOF, StringLiteral: StringLiteral
    , Keyword: Keyword, Identifier: Identifier, NumericLiteral: NumericLiteral
    , Punctuator: Punctuator, BooleanLiteral: BooleanLiteral
    , NilLiteral: NilLiteral, VarargLiteral: VarargLiteral
  };

  // As this parser is a bit different from luas own, the error messages
  // will be different in some situations.

  var errors = exports.errors = {
      unexpected: 'unexpected %1 \'%2\' near \'%3\''
    , unexpectedEOF: 'unexpected symbol near \'<eof>\''
    , expected: '\'%1\' expected near \'%2\''
    , expectedToken: '%1 expected near \'%2\''
    , unfinishedString: 'unfinished string near \'%1\''
    , malformedNumber: 'malformed number near \'%1\''
    , decimalEscapeTooLarge: 'decimal escape too large near \'%1\''
    , invalidEscape: 'invalid escape sequence near \'%1\''
    , hexadecimalDigitExpected: 'hexadecimal digit expected near \'%1\''
    , braceExpected: 'missing \'%1\' near \'%2\''
    , tooLargeCodepoint: 'UTF-8 value too large near \'%1\''
    , unfinishedLongString: 'unfinished long string (starting at line %1) near \'%2\''
    , unfinishedLongComment: 'unfinished long comment (starting at line %1) near \'%2\''
    , ambiguousSyntax: 'ambiguous syntax (function call x new statement) near \'%1\''
    , noLoopToBreak: 'no loop to break near \'%1\''
    , labelAlreadyDefined: 'label \'%1\' already defined on line %2'
    , labelNotVisible: 'no visible label \'%1\' for <goto>'
    , gotoJumpInLocalScope: '<goto %1> jumps into the scope of local \'%2\''
    , cannotUseVararg: 'cannot use \'...\' outside a vararg function near \'%1\''
    , invalidCodeUnit: 'code unit U+%1 is not allowed in the current encoding mode'
  };

  // ### Abstract Syntax Tree
  //
  // The default AST structure is inspired by the Mozilla Parser API but can
  // easily be customized by overriding these functions.

  var ast = exports.ast = {
      labelStatement: function(label) {
      return {
          type: 'LabelStatement'
        , label: label
      };
    }

    , breakStatement: function() {
      return {
          type: 'BreakStatement'
      };
    }

    , gotoStatement: function(label) {
      return {
          type: 'GotoStatement'
        , label: label
      };
    }

    , returnStatement: function(args) {
      return {
          type: 'ReturnStatement'
        , 'arguments': args
      };
    }

    , ifStatement: function(clauses) {
      return {
          type: 'IfStatement'
        , clauses: clauses
      };
    }
    , ifClause: function(condition, body) {
      return {
          type: 'IfClause'
        , condition: condition
        , body: body
      };
    }
    , elseifClause: function(condition, body) {
      return {
          type: 'ElseifClause'
        , condition: condition
        , body: body
      };
    }
    , elseClause: function(body) {
      return {
          type: 'ElseClause'
        , body: body
      };
    }

    , whileStatement: function(condition, body) {
      return {
          type: 'WhileStatement'
        , condition: condition
        , body: body
      };
    }

    , doStatement: function(body) {
      return {
          type: 'DoStatement'
        , body: body
      };
    }

    , repeatStatement: function(condition, body) {
      return {
          type: 'RepeatStatement'
        , condition: condition
        , body: body
      };
    }

    , localStatement: function(variables, init) {
      return {
          type: 'LocalStatement'
        , variables: variables
        , init: init
      };
    }

    , assignmentStatement: function(variables, init) {
      return {
          type: 'AssignmentStatement'
        , variables: variables
        , init: init
      };
    }

    , callStatement: function(expression) {
      return {
          type: 'CallStatement'
        , expression: expression
      };
    }

    , functionStatement: function(identifier, parameters, isLocal, body) {
      return {
          type: 'FunctionDeclaration'
        , identifier: identifier
        , isLocal: isLocal
        , parameters: parameters
        , body: body
      };
    }

    , forNumericStatement: function(variable, start, end, step, body) {
      return {
          type: 'ForNumericStatement'
        , variable: variable
        , start: start
        , end: end
        , step: step
        , body: body
      };
    }

    , forGenericStatement: function(variables, iterators, body) {
      return {
          type: 'ForGenericStatement'
        , variables: variables
        , iterators: iterators
        , body: body
      };
    }

    , chunk: function(body) {
      return {
          type: 'Chunk'
        , body: body
      };
    }

    , identifier: function(name) {
      return {
          type: 'Identifier'
        , name: name
      };
    }

    , literal: function(type, value, raw) {
      type = (type === StringLiteral) ? 'StringLiteral'
        : (type === NumericLiteral) ? 'NumericLiteral'
        : (type === BooleanLiteral) ? 'BooleanLiteral'
        : (type === NilLiteral) ? 'NilLiteral'
        : 'VarargLiteral';

      return {
          type: type
        , value: value
        , raw: raw
      };
    }

    , tableKey: function(key, value) {
      return {
          type: 'TableKey'
        , key: key
        , value: value
      };
    }
    , tableKeyString: function(key, value) {
      return {
          type: 'TableKeyString'
        , key: key
        , value: value
      };
    }
    , tableValue: function(value) {
      return {
          type: 'TableValue'
        , value: value
      };
    }


    , tableConstructorExpression: function(fields) {
      return {
          type: 'TableConstructorExpression'
        , fields: fields
      };
    }
    , binaryExpression: function(operator, left, right) {
      var type = ('and' === operator || 'or' === operator) ?
        'LogicalExpression' :
        'BinaryExpression';

      return {
          type: type
        , operator: operator
        , left: left
        , right: right
      };
    }
    , unaryExpression: function(operator, argument) {
      return {
          type: 'UnaryExpression'
        , operator: operator
        , argument: argument
      };
    }
    , memberExpression: function(base, indexer, identifier) {
      return {
          type: 'MemberExpression'
        , indexer: indexer
        , identifier: identifier
        , base: base
      };
    }

    , indexExpression: function(base, index) {
      return {
          type: 'IndexExpression'
        , base: base
        , index: index
      };
    }

    , callExpression: function(base, args) {
      return {
          type: 'CallExpression'
        , base: base
        , 'arguments': args
      };
    }

    , tableCallExpression: function(base, args) {
      return {
          type: 'TableCallExpression'
        , base: base
        , 'arguments': args
      };
    }

    , stringCallExpression: function(base, argument) {
      return {
          type: 'StringCallExpression'
        , base: base
        , argument: argument
      };
    }

    , comment: function(value, raw) {
      return {
          type: 'Comment'
        , value: value
        , raw: raw
      };
    }
  };

  // Wrap up the node object.

  function finishNode(node) {
    // Pop a `Marker` off the location-array and attach its location data.
    if (trackLocations) {
      var location = locations.pop();
      location.complete();
      location.bless(node);
    }
    if (options.onCreateNode) options.onCreateNode(node);
    return node;
  }


  // Helpers
  // -------

  var slice = Array.prototype.slice
    , toString = Object.prototype.toString
    ;

  var indexOf = /* istanbul ignore next */ function (array, element) {
    for (var i = 0, length = array.length; i < length; ++i) {
      if (array[i] === element) return i;
    }
    return -1;
  };

  /* istanbul ignore else */
  if (Array.prototype.indexOf)
    indexOf = function (array, element) {
      return array.indexOf(element);
    };

  // Iterate through an array of objects and return the index of an object
  // with a matching property.

  function indexOfObject(array, property, element) {
    for (var i = 0, length = array.length; i < length; ++i) {
      if (array[i][property] === element) return i;
    }
    return -1;
  }

  // A sprintf implementation using %index (beginning at 1) to input
  // arguments in the format string.
  //
  // Example:
  //
  //     // Unexpected function in token
  //     sprintf('Unexpected %2 in %1.', 'token', 'function');

  function sprintf(format) {
    var args = slice.call(arguments, 1);
    format = format.replace(/%(\d)/g, function (match, index) {
      return '' + args[index - 1] || /* istanbul ignore next */ '';
    });
    return format;
  }

  // Polyfill for `Object.assign`.

  var assign = /* istanbul ignore next */ function (dest) {
    var args = slice.call(arguments, 1)
      , src, prop;

    for (var i = 0, length = args.length; i < length; ++i) {
      src = args[i];
      for (prop in src)
        /* istanbul ignore else */
        if (Object.prototype.hasOwnProperty.call(src, prop)) {
          dest[prop] = src[prop];
        }
    }

    return dest;
  };

  /* istanbul ignore else */
  if (Object.assign)
    assign = Object.assign;

  // ### Error functions

  exports.SyntaxError = SyntaxError;

  // XXX: Eliminate this function and change the error type to be different from SyntaxError.
  // This will unfortunately be a breaking change, because some downstream users depend
  // on the error thrown being an instance of SyntaxError. For example, the Ace editor:
  // <https://github.com/ajaxorg/ace/blob/4c7e5eb3f5d5ca9434847be51834a4e41661b852/lib/ace/mode/lua_worker.js#L55>

  function fixupError(e) {
    /* istanbul ignore if */
    if (!Object.create)
      return e;
    return Object.create(e, {
      'line': { 'writable': true, value: e.line },
      'index': { 'writable': true, value: e.index },
      'column': { 'writable': true, value: e.column }
    });
  }

  // #### Raise an exception.
  //
  // Raise an exception by passing a token, a string format and its paramters.
  //
  // The passed tokens location will automatically be added to the error
  // message if it exists, if not it will default to the lexers current
  // position.
  //
  // Example:
  //
  //     // [1:0] expected [ near (
  //     raise(token, "expected %1 near %2", '[', token.value);

  function raise(token) {
    var message = sprintf.apply(null, slice.call(arguments, 1))
      , error, col;

    if (token === null || typeof token.line === 'undefined') {
      col = index - lineStart + 1;
      error = fixupError(new SyntaxError(sprintf('[%1:%2] %3', line, col, message)));
      error.index = index;
      error.line = line;
      error.column = col;
    } else {
      col = token.range[0] - token.lineStart;
      error = fixupError(new SyntaxError(sprintf('[%1:%2] %3', token.line, col, message)));
      error.line = token.line;
      error.index = token.range[0];
      error.column = col;
    }
    throw error;
  }

  function tokenValue(token) {
    var raw = input.slice(token.range[0], token.range[1]);
    if (raw)
      return raw;
    return token.value;
  }

  // #### Raise an unexpected token error.
  //
  // Example:
  //
  //     // expected <name> near '0'
  //     raiseUnexpectedToken('<name>', token);

  function raiseUnexpectedToken(type, token) {
    raise(token, errors.expectedToken, type, tokenValue(token));
  }

  // #### Raise a general unexpected error
  //
  // Usage should pass either a token object or a symbol string which was
  // expected. We can also specify a nearby token such as <eof>, this will
  // default to the currently active token.
  //
  // Example:
  //
  //     // Unexpected symbol 'end' near '<eof>'
  //     unexpected(token);
  //
  // If there's no token in the buffer it means we have reached <eof>.

  function unexpected(found) {
    var near = tokenValue(lookahead);
    if ('undefined' !== typeof found.type) {
      var type;
      switch (found.type) {
        case StringLiteral:   type = 'string';      break;
        case Keyword:         type = 'keyword';     break;
        case Identifier:      type = 'identifier';  break;
        case NumericLiteral:  type = 'number';      break;
        case Punctuator:      type = 'symbol';      break;
        case BooleanLiteral:  type = 'boolean';     break;
        case NilLiteral:
          return raise(found, errors.unexpected, 'symbol', 'nil', near);
        case EOF:
          return raise(found, errors.unexpectedEOF);
      }
      return raise(found, errors.unexpected, type, tokenValue(found), near);
    }
    return raise(found, errors.unexpected, 'symbol', found, near);
  }

  // Lexer
  // -----
  //
  // The lexer, or the tokenizer reads the input string character by character
  // and derives a token left-right. To be as efficient as possible the lexer
  // prioritizes the common cases such as identifiers. It also works with
  // character codes instead of characters as string comparisons was the
  // biggest bottleneck of the parser.
  //
  // If `options.comments` is enabled, all comments encountered will be stored
  // in an array which later will be appended to the chunk object. If disabled,
  // they will simply be disregarded.
  //
  // When the lexer has derived a valid token, it will be returned as an object
  // containing its value and as well as its position in the input string (this
  // is always enabled to provide proper debug messages).
  //
  // `lex()` starts lexing and returns the following token in the stream.

  var index
    , token
    , previousToken
    , lookahead
    , comments
    , tokenStart
    , line
    , lineStart;

  exports.lex = lex;

  function lex() {
    skipWhiteSpace();

    // Skip comments beginning with --
    while (45 === input.charCodeAt(index) &&
           45 === input.charCodeAt(index + 1)) {
      scanComment();
      skipWhiteSpace();
    }
    if (index >= length) return {
        type : EOF
      , value: '<eof>'
      , line: line
      , lineStart: lineStart
      , range: [index, index]
    };

    var charCode = input.charCodeAt(index)
      , next = input.charCodeAt(index + 1);

    // Memorize the range index where the token begins.
    tokenStart = index;
    if (isIdentifierStart(charCode)) return scanIdentifierOrKeyword();

    switch (charCode) {
      case 39: case 34: // '"
        return scanStringLiteral();

      case 48: case 49: case 50: case 51: case 52: case 53:
      case 54: case 55: case 56: case 57: // 0-9
        return scanNumericLiteral();

      case 46: // .
        // If the dot is followed by a digit it's a float.
        if (isDecDigit(next)) return scanNumericLiteral();
        if (46 === next) {
          if (46 === input.charCodeAt(index + 2)) return scanVarargLiteral();
          return scanPunctuator('..');
        }
        return scanPunctuator('.');

      case 61: // =
        if (61 === next) return scanPunctuator('==');
        return scanPunctuator('=');

      case 62: // >
        if (features.bitwiseOperators)
          if (62 === next) return scanPunctuator('>>');
        if (61 === next) return scanPunctuator('>=');
        return scanPunctuator('>');

      case 60: // <
        if (features.bitwiseOperators)
          if (60 === next) return scanPunctuator('<<');
        if (61 === next) return scanPunctuator('<=');
        return scanPunctuator('<');

      case 126: // ~
        if (61 === next) return scanPunctuator('~=');
        if (!features.bitwiseOperators)
          break;
        return scanPunctuator('~');

      case 58: // :
        if (features.labels)
          if (58 === next) return scanPunctuator('::');
        return scanPunctuator(':');

      case 91: // [
        // Check for a multiline string, they begin with [= or [[
        if (91 === next || 61 === next) return scanLongStringLiteral();
        return scanPunctuator('[');

      case 47: // /
        // Check for integer division op (//)
        if (features.integerDivision)
          if (47 === next) return scanPunctuator('//');
        return scanPunctuator('/');

      case 38: case 124: // & |
        if (!features.bitwiseOperators)
          break;

        /* fall through */
      case 42: case 94: case 37: case 44: case 123: case 125:
      case 93: case 40: case 41: case 59: case 35: case 45:
      case 43: // * ^ % , { } ] ( ) ; # - +
        return scanPunctuator(input.charAt(index));
    }

    return unexpected(input.charAt(index));
  }

  // Whitespace has no semantic meaning in lua so simply skip ahead while
  // tracking the encounted newlines. Any kind of eol sequence is counted as a
  // single line.

  function consumeEOL() {
    var charCode = input.charCodeAt(index)
      , peekCharCode = input.charCodeAt(index + 1);

    if (isLineTerminator(charCode)) {
      // Count \n\r and \r\n as one newline.
      if (10 === charCode && 13 === peekCharCode) ++index;
      if (13 === charCode && 10 === peekCharCode) ++index;
      ++line;
      lineStart = ++index;

      return true;
    }
    return false;
  }

  function skipWhiteSpace() {
    while (index < length) {
      var charCode = input.charCodeAt(index);
      if (isWhiteSpace(charCode)) {
        ++index;
      } else if (!consumeEOL()) {
        break;
      }
    }
  }

  // Identifiers, keywords, booleans and nil all look the same syntax wise. We
  // simply go through them one by one and defaulting to an identifier if no
  // previous case matched.

  function scanIdentifierOrKeyword() {
    var value, type;

    // Slicing the input string is prefered before string concatenation in a
    // loop for performance reasons.
    while (isIdentifierPart(input.charCodeAt(++index)));
    value = encodingMode.fixup(input.slice(tokenStart, index));

    // Decide on the token type and possibly cast the value.
    if (isKeyword(value)) {
      type = Keyword;
    } else if ('true' === value || 'false' === value) {
      type = BooleanLiteral;
      value = ('true' === value);
    } else if ('nil' === value) {
      type = NilLiteral;
      value = null;
    } else {
      type = Identifier;
    }

    return {
        type: type
      , value: value
      , line: line
      , lineStart: lineStart
      , range: [tokenStart, index]
    };
  }

  // Once a punctuator reaches this function it should already have been
  // validated so we simply return it as a token.

  function scanPunctuator(value) {
    index += value.length;
    return {
        type: Punctuator
      , value: value
      , line: line
      , lineStart: lineStart
      , range: [tokenStart, index]
    };
  }

  // A vararg literal consists of three dots.

  function scanVarargLiteral() {
    index += 3;
    return {
        type: VarargLiteral
      , value: '...'
      , line: line
      , lineStart: lineStart
      , range: [tokenStart, index]
    };
  }

  // Find the string literal by matching the delimiter marks used.

  function scanStringLiteral() {
    var delimiter = input.charCodeAt(index++)
      , beginLine = line
      , beginLineStart = lineStart
      , stringStart = index
      , string = encodingMode.discardStrings ? null : ''
      , charCode;

    for (;;) {
      charCode = input.charCodeAt(index++);
      if (delimiter === charCode) break;
      // EOF or `\n` terminates a string literal. If we haven't found the
      // ending delimiter by now, raise an exception.
      if (index > length || isLineTerminator(charCode)) {
        string += input.slice(stringStart, index - 1);
        raise(null, errors.unfinishedString, input.slice(tokenStart, index - 1));
      }
      if (92 === charCode) { // backslash
        if (!encodingMode.discardStrings) {
          var beforeEscape = input.slice(stringStart, index - 1);
          string += encodingMode.fixup(beforeEscape);
        }
        var escapeValue = readEscapeSequence();
        if (!encodingMode.discardStrings)
          string += escapeValue;
        stringStart = index;
      }
    }
    if (!encodingMode.discardStrings) {
      string += encodingMode.encodeByte(null);
      string += encodingMode.fixup(input.slice(stringStart, index - 1));
    }

    return {
        type: StringLiteral
      , value: string
      , line: beginLine
      , lineStart: beginLineStart
      , lastLine: line
      , lastLineStart: lineStart
      , range: [tokenStart, index]
    };
  }

  // Expect a multiline string literal and return it as a regular string
  // literal, if it doesn't validate into a valid multiline string, throw an
  // exception.

  function scanLongStringLiteral() {
    var beginLine = line
      , beginLineStart = lineStart
      , string = readLongString(false);
    // Fail if it's not a multiline literal.
    if (false === string) raise(token, errors.expected, '[', tokenValue(token));

    return {
        type: StringLiteral
      , value: encodingMode.discardStrings ? null : encodingMode.fixup(string)
      , line: beginLine
      , lineStart: beginLineStart
      , lastLine: line
      , lastLineStart: lineStart
      , range: [tokenStart, index]
    };
  }

  // Numeric literals will be returned as floating-point numbers instead of
  // strings. The raw value should be retrieved from slicing the input string
  // later on in the process.
  //
  // If a hexadecimal number is encountered, it will be converted.

  function scanNumericLiteral() {
    var character = input.charAt(index)
      , next = input.charAt(index + 1);

    var literal = ('0' === character && 'xX'.indexOf(next || null) >= 0) ?
      readHexLiteral() : readDecLiteral();

    var foundImaginaryUnit = readImaginaryUnitSuffix()
      , foundInt64Suffix = readInt64Suffix();

    if (foundInt64Suffix && (foundImaginaryUnit || literal.hasFractionPart)) {
      raise(null, errors.malformedNumber, input.slice(tokenStart, index));
    }

    return {
        type: NumericLiteral
      , value: literal.value
      , line: line
      , lineStart: lineStart
      , range: [tokenStart, index]
    };
  }

  function readImaginaryUnitSuffix() {
    if (!features.imaginaryNumbers) return;

    // Imaginary unit number suffix is optional.
    // See http://luajit.org/ext_ffi_api.html#literals
    if ('iI'.indexOf(input.charAt(index) || null) >= 0) {
      ++index;
      return true;
    } else {
      return false;
    }
  }

  function readInt64Suffix() {
    if (!features.integerSuffixes) return;

    // Int64/uint64 number suffix is optional.
    // See http://luajit.org/ext_ffi_api.html#literals

    if ('uU'.indexOf(input.charAt(index) || null) >= 0) {
      ++index;
      if ('lL'.indexOf(input.charAt(index) || null) >= 0) {
        ++index;
        if ('lL'.indexOf(input.charAt(index) || null) >= 0) {
          ++index;
          return 'ULL';
        } else {
          // UL but no L
          raise(null, errors.malformedNumber, input.slice(tokenStart, index));
        }
      } else {
        // U but no L
        raise(null, errors.malformedNumber, input.slice(tokenStart, index));
      }
    } else if ('lL'.indexOf(input.charAt(index) || null) >= 0) {
        ++index;
        if ('lL'.indexOf(input.charAt(index) || null) >= 0) {
          ++index;
          return 'LL';
        } else {
          // First L but no second L
          raise(null, errors.malformedNumber, input.slice(tokenStart, index));
        }
    }
  }

  // Lua hexadecimals have an optional fraction part and an optional binary
  // exoponent part. These are not included in JavaScript so we will compute
  // all three parts separately and then sum them up at the end of the function
  // with the following algorithm.
  //
  //     Digit := toDec(digit)
  //     Fraction := toDec(fraction) / 16 ^ fractionCount
  //     BinaryExp := 2 ^ binaryExp
  //     Number := ( Digit + Fraction ) * BinaryExp

  function readHexLiteral() {
    var fraction = 0 // defaults to 0 as it gets summed
      , binaryExponent = 1 // defaults to 1 as it gets multiplied
      , binarySign = 1 // positive
      , digit, fractionStart, exponentStart, digitStart;

    digitStart = index += 2; // Skip 0x part

    // A minimum of one hex digit is required.
    if (!isHexDigit(input.charCodeAt(index)))
      raise(null, errors.malformedNumber, input.slice(tokenStart, index));

    while (isHexDigit(input.charCodeAt(index))) ++index;
    // Convert the hexadecimal digit to base 10.
    digit = parseInt(input.slice(digitStart, index), 16);

    // Fraction part is optional.
    var foundFraction = false;
    if ('.' === input.charAt(index)) {
      foundFraction = true;
      fractionStart = ++index;

      while (isHexDigit(input.charCodeAt(index))) ++index;
      fraction = input.slice(fractionStart, index);

      // Empty fraction parts should default to 0, others should be converted
      // 0.x form so we can use summation at the end.
      fraction = (fractionStart === index) ? 0
        : parseInt(fraction, 16) / Math.pow(16, index - fractionStart);
    }

    // Binary exponents are optional
    var foundBinaryExponent = false;
    if ('pP'.indexOf(input.charAt(index) || null) >= 0) {
      foundBinaryExponent = true;
      ++index;

      // Sign part is optional and defaults to 1 (positive).
      if ('+-'.indexOf(input.charAt(index) || null) >= 0)
        binarySign = ('+' === input.charAt(index++)) ? 1 : -1;

      exponentStart = index;

      // The binary exponent sign requires a decimal digit.
      if (!isDecDigit(input.charCodeAt(index)))
        raise(null, errors.malformedNumber, input.slice(tokenStart, index));

      while (isDecDigit(input.charCodeAt(index))) ++index;
      binaryExponent = input.slice(exponentStart, index);

      // Calculate the binary exponent of the number.
      binaryExponent = Math.pow(2, binaryExponent * binarySign);
    }

    return {
      value: (digit + fraction) * binaryExponent,
      hasFractionPart: foundFraction || foundBinaryExponent
    };
  }

  // Decimal numbers are exactly the same in Lua and in JavaScript, because of
  // this we check where the token ends and then parse it with native
  // functions.

  function readDecLiteral() {
    while (isDecDigit(input.charCodeAt(index))) ++index;
    // Fraction part is optional
    var foundFraction = false;
    if ('.' === input.charAt(index)) {
      foundFraction = true;
      ++index;
      // Fraction part defaults to 0
      while (isDecDigit(input.charCodeAt(index))) ++index;
    }

    // Exponent part is optional.
    var foundExponent = false;
    if ('eE'.indexOf(input.charAt(index) || null) >= 0) {
      foundExponent = true;
      ++index;
      // Sign part is optional.
      if ('+-'.indexOf(input.charAt(index) || null) >= 0) ++index;
      // An exponent is required to contain at least one decimal digit.
      if (!isDecDigit(input.charCodeAt(index)))
        raise(null, errors.malformedNumber, input.slice(tokenStart, index));

      while (isDecDigit(input.charCodeAt(index))) ++index;
    }

    return {
      value: parseFloat(input.slice(tokenStart, index)),
      hasFractionPart: foundFraction || foundExponent
    };
  }

  function readUnicodeEscapeSequence() {
    var sequenceStart = index++;

    if (input.charAt(index++) !== '{')
      raise(null, errors.braceExpected, '{', '\\' + input.slice(sequenceStart, index));
    if (!isHexDigit(input.charCodeAt(index)))
      raise(null, errors.hexadecimalDigitExpected, '\\' + input.slice(sequenceStart, index));

    while (input.charCodeAt(index) === 0x30) ++index;
    var escStart = index;

    while (isHexDigit(input.charCodeAt(index))) {
      ++index;
      if (index - escStart > 6)
        raise(null, errors.tooLargeCodepoint, '\\' + input.slice(sequenceStart, index));
    }

    var b = input.charAt(index++);
    if (b !== '}') {
      if ((b === '"') || (b === "'"))
        raise(null, errors.braceExpected, '}', '\\' + input.slice(sequenceStart, index--));
      else
        raise(null, errors.hexadecimalDigitExpected, '\\' + input.slice(sequenceStart, index));
    }

    var codepoint = parseInt(input.slice(escStart, index - 1) || '0', 16);
    var frag = '\\' + input.slice(sequenceStart, index);

    if (codepoint > 0x10ffff) {
      raise(null, errors.tooLargeCodepoint, frag);
    }

    return encodingMode.encodeUTF8(codepoint, frag);
  }

  // Translate escape sequences to the actual characters.
  function readEscapeSequence() {
    var sequenceStart = index;
    switch (input.charAt(index)) {
      // Lua allow the following escape sequences.
      case 'a': ++index; return '\x07';
      case 'n': ++index; return '\n';
      case 'r': ++index; return '\r';
      case 't': ++index; return '\t';
      case 'v': ++index; return '\x0b';
      case 'b': ++index; return '\b';
      case 'f': ++index; return '\f';

      // Backslash at the end of the line. We treat all line endings as equivalent,
      // and as representing the [LF] character (code 10). Lua 5.1 through 5.3
      // have been verified to behave the same way.
      case '\r':
      case '\n':
        consumeEOL();
        return '\n';

      case '0': case '1': case '2': case '3': case '4':
      case '5': case '6': case '7': case '8': case '9':
        // \ddd, where ddd is a sequence of up to three decimal digits.
        while (isDecDigit(input.charCodeAt(index)) && index - sequenceStart < 3) ++index;

        var frag = input.slice(sequenceStart, index);
        var ddd = parseInt(frag, 10);
        if (ddd > 255) {
          raise(null, errors.decimalEscapeTooLarge, '\\' + ddd);
        }
        return encodingMode.encodeByte(ddd, '\\' + frag);

      case 'z':
        if (features.skipWhitespaceEscape) {
          ++index;
          skipWhiteSpace();
          return '';
        }
        break;

      case 'x':
        if (features.hexEscapes) {
          // \xXX, where XX is a sequence of exactly two hexadecimal digits
          if (isHexDigit(input.charCodeAt(index + 1)) &&
              isHexDigit(input.charCodeAt(index + 2))) {
            index += 3;
            return encodingMode.encodeByte(parseInt(input.slice(sequenceStart + 1, index), 16), '\\' + input.slice(sequenceStart, index));
          }
          raise(null, errors.hexadecimalDigitExpected, '\\' + input.slice(sequenceStart, index + 2));
        }
        break;

      case 'u':
        if (features.unicodeEscapes)
          return readUnicodeEscapeSequence();
        break;

      case '\\': case '"': case "'":
        return input.charAt(index++);
    }

    if (features.strictEscapes)
      raise(null, errors.invalidEscape, '\\' + input.slice(sequenceStart, index + 1));
    return input.charAt(index++);
  }

  // Comments begin with -- after which it will be decided if they are
  // multiline comments or not.
  //
  // The multiline functionality works the exact same way as with string
  // literals so we reuse the functionality.

  function scanComment() {
    tokenStart = index;
    index += 2; // --

    var character = input.charAt(index)
      , content = ''
      , isLong = false
      , commentStart = index
      , lineStartComment = lineStart
      , lineComment = line;

    if ('[' === character) {
      content = readLongString(true);
      // This wasn't a multiline comment after all.
      if (false === content) content = character;
      else isLong = true;
    }
    // Scan until next line as long as it's not a multiline comment.
    if (!isLong) {
      while (index < length) {
        if (isLineTerminator(input.charCodeAt(index))) break;
        ++index;
      }
      if (options.comments) content = input.slice(commentStart, index);
    }

    if (options.comments) {
      var node = ast.comment(content, input.slice(tokenStart, index));

      // `Marker`s depend on tokens available in the parser and as comments are
      // intercepted in the lexer all location data is set manually.
      if (options.locations) {
        node.loc = {
            start: { line: lineComment, column: tokenStart - lineStartComment }
          , end: { line: line, column: index - lineStart }
        };
      }
      if (options.ranges) {
        node.range = [tokenStart, index];
      }
      if (options.onCreateNode) options.onCreateNode(node);
      comments.push(node);
    }
  }

  // Read a multiline string by calculating the depth of `=` characters and
  // then appending until an equal depth is found.

  function readLongString(isComment) {
    var level = 0
      , content = ''
      , terminator = false
      , character, stringStart, firstLine = line;

    ++index; // [

    // Calculate the depth of the comment.
    while ('=' === input.charAt(index + level)) ++level;
    // Exit, this is not a long string afterall.
    if ('[' !== input.charAt(index + level)) return false;

    index += level + 1;

    // If the first character is a newline, ignore it and begin on next line.
    if (isLineTerminator(input.charCodeAt(index))) consumeEOL();

    stringStart = index;
    while (index < length) {
      // To keep track of line numbers run the `consumeEOL()` which increments
      // its counter.
      while (isLineTerminator(input.charCodeAt(index))) consumeEOL();

      character = input.charAt(index++);

      // Once the delimiter is found, iterate through the depth count and see
      // if it matches.
      if (']' === character) {
        terminator = true;
        for (var i = 0; i < level; ++i) {
          if ('=' !== input.charAt(index + i)) terminator = false;
        }
        if (']' !== input.charAt(index + level)) terminator = false;
      }

      // We reached the end of the multiline string. Get out now.
      if (terminator) {
        content += input.slice(stringStart, index - 1);
        index += level + 1;
        return content;
      }
    }

    raise(null, isComment ?
                errors.unfinishedLongComment :
                errors.unfinishedLongString,
          firstLine, '<eof>');
  }

  // ## Lex functions and helpers.

  // Read the next token.
  //
  // This is actually done by setting the current token to the lookahead and
  // reading in the new lookahead token.

  function next() {
    previousToken = token;
    token = lookahead;
    lookahead = lex();
  }

  // Consume a token if its value matches. Once consumed or not, return the
  // success of the operation.

  function consume(value) {
    if (value === token.value) {
      next();
      return true;
    }
    return false;
  }

  // Expect the next token value to match. If not, throw an exception.

  function expect(value) {
    if (value === token.value) next();
    else raise(token, errors.expected, value, tokenValue(token));
  }

  // ### Validation functions

  function isWhiteSpace(charCode) {
    return 9 === charCode || 32 === charCode || 0xB === charCode || 0xC === charCode;
  }

  function isLineTerminator(charCode) {
    return 10 === charCode || 13 === charCode;
  }

  function isDecDigit(charCode) {
    return charCode >= 48 && charCode <= 57;
  }

  function isHexDigit(charCode) {
    return (charCode >= 48 && charCode <= 57) || (charCode >= 97 && charCode <= 102) || (charCode >= 65 && charCode <= 70);
  }

  // From [Lua 5.2](http://www.lua.org/manual/5.2/manual.html#8.1) onwards
  // identifiers cannot use 'locale-dependent' letters (i.e. dependent on the C locale).
  // On the other hand, LuaJIT allows arbitrary octets ≥ 128 in identifiers.

  function isIdentifierStart(charCode) {
    if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || 95 === charCode)
      return true;
    if (features.extendedIdentifiers && charCode >= 128)
      return true;
    return false;
  }

  function isIdentifierPart(charCode) {
    if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || 95 === charCode || (charCode >= 48 && charCode <= 57))
      return true;
    if (features.extendedIdentifiers && charCode >= 128)
      return true;
    return false;
  }

  // [3.1 Lexical Conventions](http://www.lua.org/manual/5.2/manual.html#3.1)
  //
  // `true`, `false` and `nil` will not be considered keywords, but literals.

  function isKeyword(id) {
    switch (id.length) {
      case 2:
        return 'do' === id || 'if' === id || 'in' === id || 'or' === id;
      case 3:
        return 'and' === id || 'end' === id || 'for' === id || 'not' === id;
      case 4:
        if ('else' === id || 'then' === id)
          return true;
        if (features.labels && !features.contextualGoto)
          return ('goto' === id);
        return false;
      case 5:
        return 'break' === id || 'local' === id || 'until' === id || 'while' === id;
      case 6:
        return 'elseif' === id || 'repeat' === id || 'return' === id;
      case 8:
        return 'function' === id;
    }
    return false;
  }

  function isUnary(token) {
    if (Punctuator === token.type) return '#-~'.indexOf(token.value) >= 0;
    if (Keyword === token.type) return 'not' === token.value;
    return false;
  }

  // Check if the token syntactically closes a block.

  function isBlockFollow(token) {
    if (EOF === token.type) return true;
    if (Keyword !== token.type) return false;
    switch (token.value) {
      case 'else': case 'elseif':
      case 'end': case 'until':
        return true;
      default:
        return false;
    }
  }

  // Scope
  // -----

  // Store each block scope as a an array of identifier names. Each scope is
  // stored in an FILO-array.
  var scopes
    // The current scope index
    , scopeDepth
    // A list of all global identifier nodes.
    , globals;

  // Create a new scope inheriting all declarations from the previous scope.
  function createScope() {
    var scope = scopes[scopeDepth++].slice();
    scopes.push(scope);
    if (options.onCreateScope) options.onCreateScope();
  }

  // Exit and remove the current scope.
  function destroyScope() {
    var scope = scopes.pop();
    --scopeDepth;
    if (options.onDestroyScope) options.onDestroyScope();
  }

  // Add identifier name to the current scope if it doesnt already exist.
  function scopeIdentifierName(name) {
    if (options.onLocalDeclaration) options.onLocalDeclaration(name);
    if (-1 !== indexOf(scopes[scopeDepth], name)) return;
    scopes[scopeDepth].push(name);
  }

  // Add identifier to the current scope
  function scopeIdentifier(node) {
    scopeIdentifierName(node.name);
    attachScope(node, true);
  }

  // Attach scope information to node. If the node is global, store it in the
  // globals array so we can return the information to the user.
  function attachScope(node, isLocal) {
    if (!isLocal && -1 === indexOfObject(globals, 'name', node.name))
      globals.push(node);

    node.isLocal = isLocal;
  }

  // Is the identifier name available in this scope.
  function scopeHasName(name) {
    return (-1 !== indexOf(scopes[scopeDepth], name));
  }

  // Location tracking
  // -----------------
  //
  // Locations are stored in FILO-array as a `Marker` object consisting of both
  // `loc` and `range` data. Once a `Marker` is popped off the list an end
  // location is added and the data is attached to a syntax node.

  var locations = []
    , trackLocations;

  function createLocationMarker() {
    return new Marker(token);
  }

  function Marker(token) {
    if (options.locations) {
      this.loc = {
          start: {
            line: token.line
          , column: token.range[0] - token.lineStart
        }
        , end: {
            line: 0
          , column: 0
        }
      };
    }
    if (options.ranges) this.range = [token.range[0], 0];
  }

  // Complete the location data stored in the `Marker` by adding the location
  // of the *previous token* as an end location.
  Marker.prototype.complete = function() {
    if (options.locations) {
      this.loc.end.line = previousToken.lastLine || previousToken.line;
      this.loc.end.column = previousToken.range[1] - (previousToken.lastLineStart || previousToken.lineStart);
    }
    if (options.ranges) {
      this.range[1] = previousToken.range[1];
    }
  };

  Marker.prototype.bless = function (node) {
    if (this.loc) {
      var loc = this.loc;
      node.loc = {
        start: {
          line: loc.start.line,
          column: loc.start.column
        },
        end: {
          line: loc.end.line,
          column: loc.end.column
        }
      };
    }
    if (this.range) {
      node.range = [
        this.range[0],
        this.range[1]
      ];
    }
  };

  // Create a new `Marker` and add it to the FILO-array.
  function markLocation() {
    if (trackLocations) locations.push(createLocationMarker());
  }

  // Push an arbitrary `Marker` object onto the FILO-array.
  function pushLocation(marker) {
    if (trackLocations) locations.push(marker);
  }

  // Control flow tracking
  // ---------------------
  // A context object that validates loop breaks and `goto`-based control flow.

  function FullFlowContext() {
    this.scopes = [];
    this.pendingGotos = [];
  }

  FullFlowContext.prototype.isInLoop = function () {
    var i = this.scopes.length;
    while (i --> 0) {
      if (this.scopes[i].isLoop)
        return true;
    }
    return false;
  };

  FullFlowContext.prototype.pushScope = function (isLoop) {
    var scope = {
      labels: {},
      locals: [],
      deferredGotos: [],
      isLoop: !!isLoop
    };
    this.scopes.push(scope);
  };

  FullFlowContext.prototype.popScope = function () {
    for (var i = 0; i < this.pendingGotos.length; ++i) {
      var theGoto = this.pendingGotos[i];
      if (theGoto.maxDepth >= this.scopes.length)
        if (--theGoto.maxDepth <= 0)
          raise(theGoto.token, errors.labelNotVisible, theGoto.target);
    }

    this.scopes.pop();
  };

  FullFlowContext.prototype.addGoto = function (target, token) {
    var localCounts = [];

    for (var i = 0; i < this.scopes.length; ++i) {
      var scope = this.scopes[i];
      localCounts.push(scope.locals.length);
      if (Object.prototype.hasOwnProperty.call(scope.labels, target))
        return;
    }

    this.pendingGotos.push({
      maxDepth: this.scopes.length,
      target: target,
      token: token,
      localCounts: localCounts
    });
  };

  FullFlowContext.prototype.addLabel = function (name, token) {
    var scope = this.currentScope();

    if (Object.prototype.hasOwnProperty.call(scope.labels, name)) {
      raise(token, errors.labelAlreadyDefined, name, scope.labels[name].line);
    } else {
      var newGotos = [];

      for (var i = 0; i < this.pendingGotos.length; ++i) {
        var theGoto = this.pendingGotos[i];

        if (theGoto.maxDepth >= this.scopes.length && theGoto.target === name) {
          if (theGoto.localCounts[this.scopes.length - 1] < scope.locals.length) {
            scope.deferredGotos.push(theGoto);
          }
          continue;
        }

        newGotos.push(theGoto);
      }

      this.pendingGotos = newGotos;
    }

    scope.labels[name] = {
      localCount: scope.locals.length,
      line: token.line
    };
  };

  FullFlowContext.prototype.addLocal = function (name, token) {
    this.currentScope().locals.push({
      name: name,
      token: token
    });
  };

  FullFlowContext.prototype.currentScope = function () {
    return this.scopes[this.scopes.length - 1];
  };

  FullFlowContext.prototype.raiseDeferredErrors = function () {
    var scope = this.currentScope();
    var bads = scope.deferredGotos;
    for (var i = 0; i < bads.length; ++i) {
      var theGoto = bads[i];
      raise(theGoto.token, errors.gotoJumpInLocalScope, theGoto.target, scope.locals[theGoto.localCounts[this.scopes.length - 1]].name);
    }
    // Would be dead code currently, but may be useful later
    // if (bads.length)
    //   scope.deferredGotos = [];
  };

  // Simplified context that only checks the validity of loop breaks.

  function LoopFlowContext() {
    this.level = 0;
    this.loopLevels = [];
  }

  LoopFlowContext.prototype.isInLoop = function () {
    return !!this.loopLevels.length;
  };

  LoopFlowContext.prototype.pushScope = function (isLoop) {
    ++this.level;
    if (isLoop)
      this.loopLevels.push(this.level);
  };

  LoopFlowContext.prototype.popScope = function () {
    var levels = this.loopLevels;
    var levlen = levels.length;
    if (levlen) {
      if (levels[levlen - 1] === this.level)
        levels.pop();
    }
    --this.level;
  };

  LoopFlowContext.prototype.addGoto =
  LoopFlowContext.prototype.addLabel =
  /* istanbul ignore next */
  function () { throw new Error('This should never happen'); };

  LoopFlowContext.prototype.addLocal =
  LoopFlowContext.prototype.raiseDeferredErrors =
  function () {};

  function makeFlowContext() {
    return features.labels ? new FullFlowContext() : new LoopFlowContext();
  }

  // Parse functions
  // ---------------

  // Chunk is the main program object. Syntactically it's the same as a block.
  //
  //     chunk ::= block

  function parseChunk() {
    next();
    markLocation();
    if (options.scope) createScope();
    var flowContext = makeFlowContext();
    flowContext.allowVararg = true;
    flowContext.pushScope();
    var body = parseBlock(flowContext);
    flowContext.popScope();
    if (options.scope) destroyScope();
    if (EOF !== token.type) unexpected(token);
    // If the body is empty no previousToken exists when finishNode runs.
    if (trackLocations && !body.length) previousToken = token;
    return finishNode(ast.chunk(body));
  }

  // A block contains a list of statements with an optional return statement
  // as its last statement.
  //
  //     block ::= {stat} [retstat]

  function parseBlock(flowContext) {
    var block = []
      , statement;

    while (!isBlockFollow(token)) {
      // Return has to be the last statement in a block.
      // Likewise 'break' in Lua older than 5.2
      if ('return' === token.value || (!features.relaxedBreak && 'break' === token.value)) {
        block.push(parseStatement(flowContext));
        break;
      }
      statement = parseStatement(flowContext);
      consume(';');
      // Statements are only added if they are returned, this allows us to
      // ignore some statements, such as EmptyStatement.
      if (statement) block.push(statement);
    }

    // Doesn't really need an ast node
    return block;
  }

  // There are two types of statements, simple and compound.
  //
  //     statement ::= break | goto | do | while | repeat | return
  //          | if | for | function | local | label | assignment
  //          | functioncall | ';'

  function parseStatement(flowContext) {
    markLocation();

    if (Punctuator === token.type) {
      if (consume('::')) return parseLabelStatement(flowContext);
    }

    // When a `;` is encounted, simply eat it without storing it.
    if (features.emptyStatement) {
      if (consume(';')) {
        if (trackLocations) locations.pop();
        return;
      }
    }

    flowContext.raiseDeferredErrors();

    if (Keyword === token.type) {
      switch (token.value) {
        case 'local':    next(); return parseLocalStatement(flowContext);
        case 'if':       next(); return parseIfStatement(flowContext);
        case 'return':   next(); return parseReturnStatement(flowContext);
        case 'function': next();
          var name = parseFunctionName();
          return parseFunctionDeclaration(name);
        case 'while':    next(); return parseWhileStatement(flowContext);
        case 'for':      next(); return parseForStatement(flowContext);
        case 'repeat':   next(); return parseRepeatStatement(flowContext);
        case 'break':    next();
          if (!flowContext.isInLoop())
            raise(token, errors.noLoopToBreak, token.value);
          return parseBreakStatement();
        case 'do':       next(); return parseDoStatement(flowContext);
        case 'goto':     next(); return parseGotoStatement(flowContext);
      }
    }

    if (features.contextualGoto &&
        token.type === Identifier && token.value === 'goto' &&
        lookahead.type === Identifier && lookahead.value !== 'goto') {
      next(); return parseGotoStatement(flowContext);
    }

    // Assignments memorizes the location and pushes it manually for wrapper nodes.
    if (trackLocations) locations.pop();

    return parseAssignmentOrCallStatement(flowContext);
  }

  // ## Statements

  //     label ::= '::' Name '::'

  function parseLabelStatement(flowContext) {
    var nameToken = token
      , label = parseIdentifier();

    if (options.scope) {
      scopeIdentifierName('::' + nameToken.value + '::');
      attachScope(label, true);
    }

    expect('::');

    flowContext.addLabel(nameToken.value, nameToken);
    return finishNode(ast.labelStatement(label));
  }

  //     break ::= 'break'

  function parseBreakStatement() {
    return finishNode(ast.breakStatement());
  }

  //     goto ::= 'goto' Name

  function parseGotoStatement(flowContext) {
    var name = token.value
      , gotoToken = previousToken
      , label = parseIdentifier();

    flowContext.addGoto(name, gotoToken);
    return finishNode(ast.gotoStatement(label));
  }

  //     do ::= 'do' block 'end'

  function parseDoStatement(flowContext) {
    if (options.scope) createScope();
    flowContext.pushScope();
    var body = parseBlock(flowContext);
    flowContext.popScope();
    if (options.scope) destroyScope();
    expect('end');
    return finishNode(ast.doStatement(body));
  }

  //     while ::= 'while' exp 'do' block 'end'

  function parseWhileStatement(flowContext) {
    var condition = parseExpectedExpression(flowContext);
    expect('do');
    if (options.scope) createScope();
    flowContext.pushScope(true);
    var body = parseBlock(flowContext);
    flowContext.popScope();
    if (options.scope) destroyScope();
    expect('end');
    return finishNode(ast.whileStatement(condition, body));
  }

  //     repeat ::= 'repeat' block 'until' exp

  function parseRepeatStatement(flowContext) {
    if (options.scope) createScope();
    flowContext.pushScope(true);
    var body = parseBlock(flowContext);
    expect('until');
    flowContext.raiseDeferredErrors();
    var condition = parseExpectedExpression(flowContext);
    flowContext.popScope();
    if (options.scope) destroyScope();
    return finishNode(ast.repeatStatement(condition, body));
  }

  //     retstat ::= 'return' [exp {',' exp}] [';']

  function parseReturnStatement(flowContext) {
    var expressions = [];

    if ('end' !== token.value) {
      var expression = parseExpression(flowContext);
      if (null != expression) expressions.push(expression);
      while (consume(',')) {
        expression = parseExpectedExpression(flowContext);
        expressions.push(expression);
      }
      consume(';'); // grammar tells us ; is optional here.
    }
    return finishNode(ast.returnStatement(expressions));
  }

  //     if ::= 'if' exp 'then' block {elif} ['else' block] 'end'
  //     elif ::= 'elseif' exp 'then' block

  function parseIfStatement(flowContext) {
    var clauses = []
      , condition
      , body
      , marker;

    // IfClauses begin at the same location as the parent IfStatement.
    // It ends at the start of `end`, `else`, or `elseif`.
    if (trackLocations) {
      marker = locations[locations.length - 1];
      locations.push(marker);
    }
    condition = parseExpectedExpression(flowContext);
    expect('then');
    if (options.scope) createScope();
    flowContext.pushScope();
    body = parseBlock(flowContext);
    flowContext.popScope();
    if (options.scope) destroyScope();
    clauses.push(finishNode(ast.ifClause(condition, body)));

    if (trackLocations) marker = createLocationMarker();
    while (consume('elseif')) {
      pushLocation(marker);
      condition = parseExpectedExpression(flowContext);
      expect('then');
      if (options.scope) createScope();
      flowContext.pushScope();
      body = parseBlock(flowContext);
      flowContext.popScope();
      if (options.scope) destroyScope();
      clauses.push(finishNode(ast.elseifClause(condition, body)));
      if (trackLocations) marker = createLocationMarker();
    }

    if (consume('else')) {
      // Include the `else` in the location of ElseClause.
      if (trackLocations) {
        marker = new Marker(previousToken);
        locations.push(marker);
      }
      if (options.scope) createScope();
      flowContext.pushScope();
      body = parseBlock(flowContext);
      flowContext.popScope();
      if (options.scope) destroyScope();
      clauses.push(finishNode(ast.elseClause(body)));
    }

    expect('end');
    return finishNode(ast.ifStatement(clauses));
  }

  // There are two types of for statements, generic and numeric.
  //
  //     for ::= Name '=' exp ',' exp [',' exp] 'do' block 'end'
  //     for ::= namelist 'in' explist 'do' block 'end'
  //     namelist ::= Name {',' Name}
  //     explist ::= exp {',' exp}

  function parseForStatement(flowContext) {
    var variable = parseIdentifier()
      , body;

    // The start-identifier is local.

    if (options.scope) {
      createScope();
      scopeIdentifier(variable);
    }

    // If the first expression is followed by a `=` punctuator, this is a
    // Numeric For Statement.
    if (consume('=')) {
      // Start expression
      var start = parseExpectedExpression(flowContext);
      expect(',');
      // End expression
      var end = parseExpectedExpression(flowContext);
      // Optional step expression
      var step = consume(',') ? parseExpectedExpression(flowContext) : null;

      expect('do');
      flowContext.pushScope(true);
      body = parseBlock(flowContext);
      flowContext.popScope();
      expect('end');
      if (options.scope) destroyScope();

      return finishNode(ast.forNumericStatement(variable, start, end, step, body));
    }
    // If not, it's a Generic For Statement
    else {
      // The namelist can contain one or more identifiers.
      var variables = [variable];
      while (consume(',')) {
        variable = parseIdentifier();
        // Each variable in the namelist is locally scoped.
        if (options.scope) scopeIdentifier(variable);
        variables.push(variable);
      }
      expect('in');
      var iterators = [];

      // One or more expressions in the explist.
      do {
        var expression = parseExpectedExpression(flowContext);
        iterators.push(expression);
      } while (consume(','));

      expect('do');
      flowContext.pushScope(true);
      body = parseBlock(flowContext);
      flowContext.popScope();
      expect('end');
      if (options.scope) destroyScope();

      return finishNode(ast.forGenericStatement(variables, iterators, body));
    }
  }

  // Local statements can either be variable assignments or function
  // definitions. If a function definition is found, it will be delegated to
  // `parseFunctionDeclaration()` with the isLocal flag.
  //
  // This AST structure might change into a local assignment with a function
  // child.
  //
  //     local ::= 'local' 'function' Name funcdecl
  //        | 'local' Name {',' Name} ['=' exp {',' exp}]

  function parseLocalStatement(flowContext) {
    var name
      , declToken = previousToken;

    if (Identifier === token.type) {
      var variables = []
        , init = [];

      do {
        name = parseIdentifier();

        variables.push(name);
        flowContext.addLocal(name.name, declToken);
      } while (consume(','));

      if (consume('=')) {
        do {
          var expression = parseExpectedExpression(flowContext);
          init.push(expression);
        } while (consume(','));
      }

      // Declarations doesn't exist before the statement has been evaluated.
      // Therefore assignments can't use their declarator. And the identifiers
      // shouldn't be added to the scope until the statement is complete.
      if (options.scope) {
        for (var i = 0, l = variables.length; i < l; ++i) {
          scopeIdentifier(variables[i]);
        }
      }

      return finishNode(ast.localStatement(variables, init));
    }
    if (consume('function')) {
      name = parseIdentifier();
      flowContext.addLocal(name.name, declToken);

      if (options.scope) {
        scopeIdentifier(name);
        createScope();
      }

      // MemberExpressions are not allowed in local function statements.
      return parseFunctionDeclaration(name, true);
    } else {
      raiseUnexpectedToken('<name>', token);
    }
  }

  //     assignment ::= varlist '=' explist
  //     var ::= Name | prefixexp '[' exp ']' | prefixexp '.' Name
  //     varlist ::= var {',' var}
  //     explist ::= exp {',' exp}
  //
  //     call ::= callexp
  //     callexp ::= prefixexp args | prefixexp ':' Name args

  function parseAssignmentOrCallStatement(flowContext) {
    // Keep a reference to the previous token for better error messages in case
    // of invalid statement
    var previous = token
      , marker, startMarker;
    var lvalue, base, name;

    var targets = [];

    if (trackLocations) startMarker = createLocationMarker();

    do {
      if (trackLocations) marker = createLocationMarker();

      if (Identifier === token.type) {
        name = token.value;
        base = parseIdentifier();
        // Set the parent scope.
        if (options.scope) attachScope(base, scopeHasName(name));
        lvalue = true;
      } else if ('(' === token.value) {
        next();
        base = parseExpectedExpression(flowContext);
        expect(')');
        lvalue = false;
      } else {
        return unexpected(token);
      }

      both: for (;;) {
        var newBase;

        switch (StringLiteral === token.type ? '"' : token.value) {
        case '.':
        case '[':
          lvalue = true;
          break;
        case ':':
        case '(':
        case '{':
        case '"':
          lvalue = null;
          break;
        default:
          break both;
        }

        base = parsePrefixExpressionPart(base, marker, flowContext);
      }

      targets.push(base);

      if (',' !== token.value)
        break;

      if (!lvalue) {
        return unexpected(token);
      }

      next();
    } while (true);

    if (targets.length === 1 && lvalue === null) {
      pushLocation(marker);
      return finishNode(ast.callStatement(targets[0]));
    } else if (!lvalue) {
      return unexpected(token);
    }

    expect('=');

    var values = [];

    do {
      values.push(parseExpectedExpression(flowContext));
    } while (consume(','));

    pushLocation(startMarker);
    return finishNode(ast.assignmentStatement(targets, values));
  }

  // ### Non-statements

  //     Identifier ::= Name

  function parseIdentifier() {
    markLocation();
    var identifier = token.value;
    if (Identifier !== token.type) raiseUnexpectedToken('<name>', token);
    next();
    return finishNode(ast.identifier(identifier));
  }

  // Parse the functions parameters and body block. The name should already
  // have been parsed and passed to this declaration function. By separating
  // this we allow for anonymous functions in expressions.
  //
  // For local functions there's a boolean parameter which needs to be set
  // when parsing the declaration.
  //
  //     funcdecl ::= '(' [parlist] ')' block 'end'
  //     parlist ::= Name {',' Name} | [',' '...'] | '...'

  function parseFunctionDeclaration(name, isLocal) {
    var flowContext = makeFlowContext();
    flowContext.pushScope();

    var parameters = [];
    expect('(');

    // The declaration has arguments
    if (!consume(')')) {
      // Arguments are a comma separated list of identifiers, optionally ending
      // with a vararg.
      while (true) {
        if (Identifier === token.type) {
          var parameter = parseIdentifier();
          // Function parameters are local.
          if (options.scope) scopeIdentifier(parameter);

          parameters.push(parameter);

          if (consume(',')) continue;
        }
        // No arguments are allowed after a vararg.
        else if (VarargLiteral === token.type) {
          flowContext.allowVararg = true;
          parameters.push(parsePrimaryExpression(flowContext));
        } else {
          raiseUnexpectedToken('<name> or \'...\'', token);
        }
        expect(')');
        break;
      }
    }

    var body = parseBlock(flowContext);
    flowContext.popScope();
    expect('end');
    if (options.scope) destroyScope();

    isLocal = isLocal || false;
    return finishNode(ast.functionStatement(name, parameters, isLocal, body));
  }

  // Parse the function name as identifiers and member expressions.
  //
  //     Name {'.' Name} [':' Name]

  function parseFunctionName() {
    var base, name, marker;

    if (trackLocations) marker = createLocationMarker();
    base = parseIdentifier();

    if (options.scope) {
      attachScope(base, scopeHasName(base.name));
      createScope();
    }

    while (consume('.')) {
      pushLocation(marker);
      name = parseIdentifier();
      base = finishNode(ast.memberExpression(base, '.', name));
    }

    if (consume(':')) {
      pushLocation(marker);
      name = parseIdentifier();
      base = finishNode(ast.memberExpression(base, ':', name));
      if (options.scope) scopeIdentifierName('self');
    }

    return base;
  }

  //     tableconstructor ::= '{' [fieldlist] '}'
  //     fieldlist ::= field {fieldsep field} fieldsep
  //     field ::= '[' exp ']' '=' exp | Name = 'exp' | exp
  //
  //     fieldsep ::= ',' | ';'

  function parseTableConstructor(flowContext) {
    var fields = []
      , key, value;

    while (true) {
      markLocation();
      if (Punctuator === token.type && consume('[')) {
        key = parseExpectedExpression(flowContext);
        expect(']');
        expect('=');
        value = parseExpectedExpression(flowContext);
        fields.push(finishNode(ast.tableKey(key, value)));
      } else if (Identifier === token.type) {
        if ('=' === lookahead.value) {
          key = parseIdentifier();
          next();
          value = parseExpectedExpression(flowContext);
          fields.push(finishNode(ast.tableKeyString(key, value)));
        } else {
          value = parseExpectedExpression(flowContext);
          fields.push(finishNode(ast.tableValue(value)));
        }
      } else {
        if (null == (value = parseExpression(flowContext))) {
          locations.pop();
          break;
        }
        fields.push(finishNode(ast.tableValue(value)));
      }
      if (',;'.indexOf(token.value) >= 0) {
        next();
        continue;
      }
      break;
    }
    expect('}');
    return finishNode(ast.tableConstructorExpression(fields));
  }

  // Expression parser
  // -----------------
  //
  // Expressions are evaluated and always return a value. If nothing is
  // matched null will be returned.
  //
  //     exp ::= (unop exp | primary | prefixexp ) { binop exp }
  //
  //     primary ::= nil | false | true | Number | String | '...'
  //          | functiondef | tableconstructor
  //
  //     prefixexp ::= (Name | '(' exp ')' ) { '[' exp ']'
  //          | '.' Name | ':' Name args | args }
  //

  function parseExpression(flowContext) {
    var expression = parseSubExpression(0, flowContext);
    return expression;
  }

  // Parse an expression expecting it to be valid.

  function parseExpectedExpression(flowContext) {
    var expression = parseExpression(flowContext);
    if (null == expression) raiseUnexpectedToken('<expression>', token);
    else return expression;
  }


  // Return the precedence priority of the operator.
  //
  // As unary `-` can't be distinguished from binary `-`, unary precedence
  // isn't described in this table but in `parseSubExpression()` itself.
  //
  // As this function gets hit on every expression it's been optimized due to
  // the expensive CompareICStub which took ~8% of the parse time.

  function binaryPrecedence(operator) {
    var charCode = operator.charCodeAt(0)
      , length = operator.length;

    if (1 === length) {
      switch (charCode) {
        case 94: return 12; // ^
        case 42: case 47: case 37: return 10; // * / %
        case 43: case 45: return 9; // + -
        case 38: return 6; // &
        case 126: return 5; // ~
        case 124: return 4; // |
        case 60: case 62: return 3; // < >
      }
    } else if (2 === length) {
      switch (charCode) {
        case 47: return 10; // //
        case 46: return 8; // ..
        case 60: case 62:
            if('<<' === operator || '>>' === operator) return 7; // << >>
            return 3; // <= >=
        case 61: case 126: return 3; // == ~=
        case 111: return 1; // or
      }
    } else if (97 === charCode && 'and' === operator) return 2;
    return 0;
  }

  // Implement an operator-precedence parser to handle binary operator
  // precedence.
  //
  // We use this algorithm because it's compact, it's fast and Lua core uses
  // the same so we can be sure our expressions are parsed in the same manner
  // without excessive amounts of tests.
  //
  //     exp ::= (unop exp | primary | prefixexp ) { binop exp }

  function parseSubExpression(minPrecedence, flowContext) {
    var operator = token.value
    // The left-hand side in binary operations.
      , expression, marker;

    if (trackLocations) marker = createLocationMarker();

    // UnaryExpression
    if (isUnary(token)) {
      markLocation();
      next();
      var argument = parseSubExpression(10, flowContext);
      if (argument == null) raiseUnexpectedToken('<expression>', token);
      expression = finishNode(ast.unaryExpression(operator, argument));
    }
    if (null == expression) {
      // PrimaryExpression
      expression = parsePrimaryExpression(flowContext);

      // PrefixExpression
      if (null == expression) {
        expression = parsePrefixExpression(flowContext);
      }
    }
    // This is not a valid left hand expression.
    if (null == expression) return null;

    var precedence;
    while (true) {
      operator = token.value;

      precedence = (Punctuator === token.type || Keyword === token.type) ?
        binaryPrecedence(operator) : 0;

      if (precedence === 0 || precedence <= minPrecedence) break;
      // Right-hand precedence operators
      if ('^' === operator || '..' === operator) --precedence;
      next();
      var right = parseSubExpression(precedence, flowContext);
      if (null == right) raiseUnexpectedToken('<expression>', token);
      // Push in the marker created before the loop to wrap its entirety.
      if (trackLocations) locations.push(marker);
      expression = finishNode(ast.binaryExpression(operator, expression, right));

    }
    return expression;
  }

  //     prefixexp ::= prefix {suffix}
  //     prefix ::= Name | '(' exp ')'
  //     suffix ::= '[' exp ']' | '.' Name | ':' Name args | args
  //
  //     args ::= '(' [explist] ')' | tableconstructor | String

  function parsePrefixExpressionPart(base, marker, flowContext) {
    var expression, identifier;

    if (Punctuator === token.type) {
      switch (token.value) {
        case '[':
          pushLocation(marker);
          next();
          expression = parseExpectedExpression(flowContext);
          expect(']');
          return finishNode(ast.indexExpression(base, expression));
        case '.':
          pushLocation(marker);
          next();
          identifier = parseIdentifier();
          return finishNode(ast.memberExpression(base, '.', identifier));
        case ':':
          pushLocation(marker);
          next();
          identifier = parseIdentifier();
          base = finishNode(ast.memberExpression(base, ':', identifier));
          // Once a : is found, this has to be a CallExpression, otherwise
          // throw an error.
          pushLocation(marker);
          return parseCallExpression(base, flowContext);
        case '(': case '{': // args
          pushLocation(marker);
          return parseCallExpression(base, flowContext);
      }
    } else if (StringLiteral === token.type) {
      pushLocation(marker);
      return parseCallExpression(base, flowContext);
    }

    return null;
  }

  function parsePrefixExpression(flowContext) {
    var base, name, marker;

    if (trackLocations) marker = createLocationMarker();

    // The prefix
    if (Identifier === token.type) {
      name = token.value;
      base = parseIdentifier();
      // Set the parent scope.
      if (options.scope) attachScope(base, scopeHasName(name));
    } else if (consume('(')) {
      base = parseExpectedExpression(flowContext);
      expect(')');
    } else {
      return null;
    }

    // The suffix
    for (;;) {
      var newBase = parsePrefixExpressionPart(base, marker, flowContext);
      if (newBase === null)
        break;
      base = newBase;
    }

    return base;
  }

  //     args ::= '(' [explist] ')' | tableconstructor | String

  function parseCallExpression(base, flowContext) {
    if (Punctuator === token.type) {
      switch (token.value) {
        case '(':
          if (!features.emptyStatement) {
            if (token.line !== previousToken.line)
              raise(null, errors.ambiguousSyntax, token.value);
          }
          next();

          // List of expressions
          var expressions = [];
          var expression = parseExpression(flowContext);
          if (null != expression) expressions.push(expression);
          while (consume(',')) {
            expression = parseExpectedExpression(flowContext);
            expressions.push(expression);
          }

          expect(')');
          return finishNode(ast.callExpression(base, expressions));

        case '{':
          markLocation();
          next();
          var table = parseTableConstructor(flowContext);
          return finishNode(ast.tableCallExpression(base, table));
      }
    } else if (StringLiteral === token.type) {
      return finishNode(ast.stringCallExpression(base, parsePrimaryExpression(flowContext)));
    }

    raiseUnexpectedToken('function arguments', token);
  }

  //     primary ::= String | Numeric | nil | true | false
  //          | functiondef | tableconstructor | '...'

  function parsePrimaryExpression(flowContext) {
    var literals = StringLiteral | NumericLiteral | BooleanLiteral | NilLiteral | VarargLiteral
      , value = token.value
      , type = token.type
      , marker;

    if (trackLocations) marker = createLocationMarker();

    if (type === VarargLiteral && !flowContext.allowVararg) {
      raise(token, errors.cannotUseVararg, token.value);
    }

    if (type & literals) {
      pushLocation(marker);
      var raw = input.slice(token.range[0], token.range[1]);
      next();
      return finishNode(ast.literal(type, value, raw));
    } else if (Keyword === type && 'function' === value) {
      pushLocation(marker);
      next();
      if (options.scope) createScope();
      return parseFunctionDeclaration(null);
    } else if (consume('{')) {
      pushLocation(marker);
      return parseTableConstructor(flowContext);
    }
  }

  // Parser
  // ------

  // Export the main parser.
  //
  //   - `wait` Hold parsing until end() is called. Defaults to false
  //   - `comments` Store comments. Defaults to true.
  //   - `scope` Track identifier scope. Defaults to false.
  //   - `locations` Store location information. Defaults to false.
  //   - `ranges` Store the start and end character locations. Defaults to
  //     false.
  //   - `onCreateNode` Callback which will be invoked when a syntax node is
  //     created.
  //   - `onCreateScope` Callback which will be invoked when a new scope is
  //     created.
  //   - `onDestroyScope` Callback which will be invoked when the current scope
  //     is destroyed.
  //
  // Example:
  //
  //     var parser = require('luaparser');
  //     parser.parse('i = 0');

  exports.parse = parse;

  var versionFeatures = {
    '5.1': {
    },
    '5.2': {
      labels: true,
      emptyStatement: true,
      hexEscapes: true,
      skipWhitespaceEscape: true,
      strictEscapes: true,
      relaxedBreak: true
    },
    '5.3': {
      labels: true,
      emptyStatement: true,
      hexEscapes: true,
      skipWhitespaceEscape: true,
      strictEscapes: true,
      unicodeEscapes: true,
      bitwiseOperators: true,
      integerDivision: true,
      relaxedBreak: true
    },
    'LuaJIT': {
      // XXX: LuaJIT language features may depend on compilation options; may need to
      // rethink how to handle this. Specifically, there is a LUAJIT_ENABLE_LUA52COMPAT
      // that removes contextual goto. Maybe add 'LuaJIT-5.2compat' as well?
      labels: true,
      contextualGoto: true,
      hexEscapes: true,
      skipWhitespaceEscape: true,
      strictEscapes: true,
      unicodeEscapes: true,
      imaginaryNumbers: true,
      integerSuffixes: true
    }
  };

  function parse(_input, _options) {
    if ('undefined' === typeof _options && 'object' === typeof _input) {
      _options = _input;
      _input = undefined;
    }
    if (!_options) _options = {};

    input = _input || '';
    options = assign({}, defaultOptions, _options);

    // Rewind the lexer
    index = 0;
    line = 1;
    lineStart = 0;
    length = input.length;
    // When tracking identifier scope, initialize with an empty scope.
    scopes = [[]];
    scopeDepth = 0;
    globals = [];
    locations = [];

    if (!Object.prototype.hasOwnProperty.call(versionFeatures, options.luaVersion)) {
      throw new Error(sprintf("Lua version '%1' not supported", options.luaVersion));
    }

    features = assign({}, versionFeatures[options.luaVersion]);
    if (options.extendedIdentifiers !== void 0)
      features.extendedIdentifiers = !!options.extendedIdentifiers;

    if (!Object.prototype.hasOwnProperty.call(encodingModes, options.encodingMode)) {
      throw new Error(sprintf("Encoding mode '%1' not supported", options.encodingMode));
    }

    encodingMode = encodingModes[options.encodingMode];

    if (options.comments) comments = [];
    if (!options.wait) return end();
    return exports;
  }

  // Write to the source code buffer without beginning the parse.
  exports.write = write;

  function write(_input) {
    input += String(_input);
    length = input.length;
    return exports;
  }

  // Send an EOF and begin parsing.
  exports.end = end;

  function end(_input) {
    if ('undefined' !== typeof _input) write(_input);

    // Ignore shebangs.
    if (input && input.substr(0, 2) === '#!') input = input.replace(/^.*/, function (line) {
      return line.replace(/./g, ' ');
    });

    length = input.length;
    trackLocations = options.locations || options.ranges;
    // Initialize with a lookahead token.
    lookahead = lex();

    var chunk = parseChunk();
    if (options.comments) chunk.comments = comments;
    if (options.scope) chunk.globals = globals;

    /* istanbul ignore if */
    if (locations.length > 0)
      throw new Error('Location tracking failed. This is most likely a bug in luaparse');

    return chunk;
  }

}));
/* vim: set sw=2 ts=2 et tw=79 : */


/***/ }),
/* 4 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   sprintf: () => (/* binding */ sprintf),
/* harmony export */   version: () => (/* binding */ version),
/* harmony export */   vsprintf: () => (/* binding */ vsprintf)
/* harmony export */ });
/* printj.js (C) 2016-present SheetJS -- http://sheetjs.com */
/* vim: set ts=2: */
/*jshint sub:true, eqnull:true */
/*exported PRINTJ */
/*:: declare var DO_NOT_EXPORT_PRINTJ:?boolean; */
/*:: declare function define(cb:()=>any):void; */

var PRINTJ/*:PRINTJModule*/ = /*::(*/{}/*:: :any)*/;

PRINTJ.version = '1.3.1';

const version = PRINTJ.version;

var tcache = {};

function tokenize(fmt/*:string*/)/*:ParsedFmt*/ {
	if(tcache[fmt]) return tcache[fmt];
	var out/*:ParsedFmt*/ = [];
	var start/*:number*/ = 0;

	var i/*:number*/ = 0;
	var infmt/*:boolean*/ = false;
	var fmtparam/*:string*/ = "", fmtflags/*:string*/ = "", fmtwidth/*:string*/ = "", fmtprec/*:string*/ = "", fmtlen/*:string*/ = "";

	var c/*:number*/ = 0;

	var L/*:number*/ = fmt.length;

	for(; i < L; ++i) {
		c = fmt.charCodeAt(i);
		if(!infmt) {

			if(c !== 37) continue;

			if(start < i) out.push(["L", fmt.substring(start, i)]);
			start = i;
			infmt = true;
			continue;
		}

		if(c >= 48 && c < 58)	{
				if(fmtprec.length) fmtprec += String.fromCharCode(c);
				else if(c == 48 && !fmtwidth.length) fmtflags += String.fromCharCode(c);
				else fmtwidth += String.fromCharCode(c);
		} else switch(c) {
			/* positional */
			case 36:
				if(fmtprec.length) fmtprec += "$";
				else if(fmtwidth.charAt(0) == "*") fmtwidth += "$";
				else { fmtparam = fmtwidth + "$"; fmtwidth = ""; }
				break;

			/* flags */
			case 39: fmtflags += "'"; break;
			case 45: fmtflags += "-"; break;
			case 43: fmtflags += "+"; break;
			case 32: fmtflags += " "; break;
			case 35: fmtflags += "#"; break;

			/* width and precision */
			case 46: fmtprec = "."; break;
			case 42:
				if(fmtprec.charAt(0) == ".") fmtprec += "*";
				else fmtwidth += "*";
				break;

			/* length */
			case 104:
			case 108:
				if(fmtlen.length > 1) throw "bad length " + fmtlen + String(c);
				fmtlen += String.fromCharCode(c);
				break;

			case  76:
			case 106:
			case 122:
			case 116:
			case 113:
			case  90:
			case 119:
				if(fmtlen !== "") throw "bad length " + fmtlen + String.fromCharCode(c);
				fmtlen = String.fromCharCode(c);
				break;

			case 73:
				if(fmtlen !== "") throw "bad length " + fmtlen + 'I';
				fmtlen = 'I';
				break;

			/* conversion */
			case 100:
			case 105:
			case 111:
			case 117:
			case 120:
			case 88:
			case 102:
			case 70:
			case 101:
			case 69:
			case 103:
			case 71:
			case 97:
			case 65:
			case 99:
			case 67:
			case 115:
			case 83:
			case 112:
			case 110:
			case 68:
			case 85:
			case 79:
			case 109:
			case 98:
			case 66:
			case 121:
			case 89:
			case 74:
			case 86:
			case 84:
			case 37:
				infmt = false;
				if(fmtprec.length > 1) fmtprec = fmtprec.substr(1);
				out.push([String.fromCharCode(c), fmt.substring(start, i+1), fmtparam, fmtflags, fmtwidth, fmtprec, fmtlen]);
				start = i+1;
				fmtlen = fmtprec = fmtwidth = fmtflags = fmtparam = "";
				break;
			default:
				throw new Error("Invalid format string starting with |" + fmt.substring(start, i+1) + "|");
		}

	}

	if(start < fmt.length) out.push(["L", fmt.substring(start)]);
	return (tcache[fmt] = out);
}

var u_inspect/*:(o:any)=>string*/ = JSON.stringify;

function doit(t/*:ParsedFmt*/, args/*:Array<any>*/)/*:string*/ {
	//var o/*:Array<string>*/ = [];
	var o = "";
	var argidx/*:number*/ = 0, idx/*:number*/ = 0;
	var Vnum/*:number*/ = 0;
	var pad/*:string*/ = "";
	for(var i/*:number*/ = 0; i < t.length; ++i) {
		var m/*:ParsedEntry*/ = t[i], c/*:number*/ = (m[0]/*:string*/).charCodeAt(0);
		/* m order: conv full param flags width prec length */

		if(c === /*L*/ 76) { o += /*o.push*/(m[1]); continue; }
		if(c === /*%*/ 37) { o += /*o.push*/("%"); continue; }

		var O/*:string*/ = "";
		var isnum/*:number*/ = 0, radix/*:number*/ = 10, bytes/*:number*/ = 4, sign/*:boolean*/ = false;

		/* flags */
		var flags/*:string*/ = m[3]/*||""*/;
		var alt/*:boolean*/ = flags.indexOf("#") > -1;

		/* position */
		if(m[2]) argidx = parseInt(m[2], 10)-1;
		/* %m special case */
		else if(c === /*m*/ 109 && !alt) { o += /*.push*/("Success"); continue; }

		/* grab width */
		var width =  0; if( m[ 4].length > 0) { if(m[ 4].charAt(0) !== '*') width = parseInt(m[ 4], 10); else if(m[ 4].length === 1) width = args[idx++]; else width = args[parseInt(m[ 4].substr(1), 10)-1]; }

		/* grab precision */
		var prec =  -1; if( m[ 5].length > 0) { if(m[ 5].charAt(0) !== '*') prec = parseInt(m[ 5], 10); else if(m[ 5].length === 1) prec = args[idx++]; else prec = args[parseInt(m[ 5].substr(1), 10)-1]; }

		/* position not specified */
		if(!m[2]) argidx = idx++;

		/* grab argument */
		var arg/*:any*/ = args[argidx];

		/* grab length */
		var len/*:string*/ = m[6]/* || ""*/;

		switch(c) {
			/* str cCsS */

			case /*S*/  83:
			case /*s*/ 115:
				/* only valid flag is "-" for left justification */
				O = String(arg);
				if( prec >= 0) O = O.substr(0,  prec);
				if( width > O.length || - width > O.length) { if(( flags.indexOf("-") == -1 ||  width < 0) &&  flags.indexOf("0") != -1) { pad = ( width - O.length >= 0 ? "0".repeat( width - O.length) : ""); O = pad + O; } else { pad = ( width - O.length >= 0 ? " ".repeat( width - O.length) : ""); O =  flags.indexOf("-") > -1 ? O + pad : pad + O; } }
				break;

			/* first char of string or convert */
			case /*C*/  67:
			case /*c*/  99:
				switch(typeof arg) {
					case "number":
						var cc/*:number*/ = arg;
						if(c == 67 || len.charCodeAt(0) === /*l*/ 108) {  cc &= 0xFFFFFFFF; O = String.fromCharCode( cc); }
						else {  cc &= 0xFF; O = String.fromCharCode( cc); }
						break;
					case "string": O = /*::(*/arg/*:: :string)*/.charAt(0); break;
					default: O = String(arg).charAt(0);
				}
				if( width > O.length || - width > O.length) { if(( flags.indexOf("-") == -1 ||  width < 0) &&  flags.indexOf("0") != -1) { pad = ( width - O.length >= 0 ? "0".repeat( width - O.length) : ""); O = pad + O; } else { pad = ( width - O.length >= 0 ? " ".repeat( width - O.length) : ""); O =  flags.indexOf("-") > -1 ? O + pad : pad + O; } }
				break;

			/* int diDuUoOxXbB */

			/* signed integer */
			case /*D*/  68: bytes = 8;
			/* falls through */
			case /*d*/ 100:
			case /*i*/ 105: isnum = -1; sign = true; break;

			/* unsigned integer */
			case /*U*/  85: bytes = 8;
			/* falls through */
			case /*u*/ 117: isnum = -1; break;

			/* unsigned octal */
			case /*O*/  79: bytes = 8;
			/* falls through */
			case /*o*/ 111: isnum = -1; radix = (8); break;

			/* unsigned hex */
			case /*x*/ 120: isnum = -1; radix = (-16); break;
			case /*X*/  88: isnum = -1; radix = (16); break;

			/* unsigned binary (extension) */
			case /*B*/  66: bytes = 8;
			/* falls through */
			case /*b*/  98: isnum = -1; radix = (2); break;

			/* flt fegFEGaA */

			/* floating point logic */
			case /*F*/  70:
			case /*f*/ 102: isnum = (1); break;

			case /*E*/  69:
			case /*e*/ 101: isnum = (2); break;

			case /*G*/  71:
			case /*g*/ 103: isnum = (3); break;

			/* floating hex */
			case /*A*/  65:
			case /*a*/  97: isnum = (4); break;

			/* misc pnmJVTyY */

			/* JS has no concept of pointers so interpret the `l` key as an address */
			case /*p*/ 112:
				Vnum = typeof arg == "number" ? arg : arg ? Number(arg.l) : -1;
				if(isNaN(Vnum)) Vnum = -1;
				if(alt) O = Vnum.toString(10);
				else {
					Vnum = Math.abs(Vnum);
					O = "0x" + Vnum.toString(16).toLowerCase();
				}
				break;

			/* store length in the `len` key */
			case /*n*/ 110:
				if(arg) { arg.len = o.length; }
				//if(arg) { arg.len=0; for(var oo/*:number*/ = 0; oo < o.length; ++oo) arg.len += o[oo].length; }
				continue;

			/* process error */
			case /*m*/ 109:
				if(!(arg instanceof Error)) O = "Success";
				else if(arg.message) O = arg.message;
				else if(arg.errno) O = "Error number " + arg.errno;
				else O = "Error " + String(arg);
				break;

			/* JS-specific conversions (extension) */
			case /*J*/  74: O = (alt ? u_inspect : JSON.stringify)(arg); break;
			case /*V*/  86: O = arg == null ? "null" : String(arg.valueOf()); break;
			case /*T*/  84:
				if(alt) { /* from '[object %s]' extract %s */
					O = Object.prototype.toString.call(arg).substr(8);
					O = O.substr(0, O.length - 1);
				} else O = typeof arg;
				break;

			/* boolean (extension) */
			case /*Y*/  89:
			case /*y*/ 121:
				O = (arg) ? (alt ? "yes" : "true") : (alt ? "no" : "false");
				if(c == /*Y*/ 89) O = O.toUpperCase();
				if( prec >= 0) O = O.substr(0,  prec);
				if( width > O.length || - width > O.length) { if(( flags.indexOf("-") == -1 ||  width < 0) &&  flags.indexOf("0") != -1) { pad = ( width - O.length >= 0 ? "0".repeat( width - O.length) : ""); O = pad + O; } else { pad = ( width - O.length >= 0 ? " ".repeat( width - O.length) : ""); O =  flags.indexOf("-") > -1 ? O + pad : pad + O; } }
				break;

		}

		if(width < 0) { width = -width; flags += "-"; }

		if(isnum == -1) {

			Vnum = Number(arg);

			/* parse byte length field */

			switch(len) {
				/* char */
				case "hh": { bytes = 1; } break;
				/* short */
				case "h":  { bytes = 2; } break;

				/* long */
				case "l":  { if(bytes == 4) bytes = 8; } break;

				/* long long */
				case "L":
				case "q":
				case "ll": { if(bytes == 4) bytes = 8; } break;

				/* intmax_t */
				case "j":  { if(bytes == 4) bytes = 8; } break;

				/* ptrdiff_t */
				case "t":  { if(bytes == 4) bytes = 8; } break;

				/* size_t */
				case "z":
				case "Z":  { if(bytes == 4) bytes = 8; } break;

				/* CRT size_t or ptrdiff_t */
				case "I":

					{ if(bytes == 4) bytes = 8; }

					break;

				/* CRT wchar_t */
				case "w": break;
			}

			/* restrict value */

			switch(bytes) {
				case 1: Vnum = (Vnum & 0xFF); if(sign && (Vnum >  0x7F)) Vnum -= (0xFF + 1); break;
				case 2: Vnum = (Vnum & 0xFFFF); if(sign && (Vnum >  0x7FFF)) Vnum -= (0xFFFF + 1); break;
				case 4: Vnum = sign ? (Vnum | 0) : (Vnum >>> 0); break;
				default: Vnum = isNaN(Vnum) ? 0 : Math.round(Vnum); break;
			}

			/* generate string */
			if(bytes > 4 && Vnum < 0 && !sign) {
				if(radix == 16 || radix == -16) {
					O = (Vnum>>>0).toString(16);
					Vnum = Math.floor((Vnum - (Vnum >>> 0)) / Math.pow(2,32));
					O = (Vnum>>>0).toString(16) + (8 - O.length >= 0 ?  "0".repeat(8 - O.length) : "") + O;
					O = (16 - O.length >= 0 ?  "f".repeat(16 - O.length) : "") + O;
					if(radix == 16) O = O.toUpperCase();
				} else if(radix == 8) {
					O = (Vnum>>>0).toString(8);
					O = (10 - O.length >= 0 ?  "0".repeat(10 - O.length) : "") + O;
					Vnum = Math.floor((Vnum - ((Vnum >>> 0)&0x3FFFFFFF)) / Math.pow(2,30));
					O = (Vnum>>>0).toString(8) + O.substr(O.length - 10);
					O = O.substr(O.length - 20);
					O = "1" + (21 - O.length >= 0 ?  "7".repeat(21 - O.length) : "") + O;
				} else {
					Vnum = (-Vnum) % 1e16;
					var d1/*:Array<number>*/ = [1,8,4,4,6,7,4,4,0,7,3,7,0,9,5,5,1,6,1,6];
					var di/*:number*/ = d1.length - 1;
					while(Vnum > 0) {
						if((d1[di] -= (Vnum % 10)) < 0) { d1[di] += 10; d1[di-1]--; }
						--di; Vnum = Math.floor(Vnum / 10);
					}
					O = d1.join("");
				}
			} else {
				if(radix === -16) O = Vnum.toString(16).toLowerCase();
				else if(radix === 16) O = Vnum.toString(16).toUpperCase();
				else O = Vnum.toString(radix);
			}

			/* apply precision */
			if(prec ===0 && O == "0" && !(radix == 8 && alt)) O = ""; /* bail out */
			else {
				if(O.length < prec + (O.substr(0,1) == "-" ? 1 : 0)) {
					if(O.substr(0,1) != "-") O = (prec - O.length >= 0 ?  "0".repeat(prec - O.length) : "") + O;
					else O = O.substr(0,1) + (prec + 1 - O.length >= 0 ?  "0".repeat(prec + 1 - O.length) : "") + O.substr(1);
				}

				/* add prefix for # form */
				if(!sign && alt && Vnum !== 0) switch(radix) {
					case -16: O = "0x" + O; break;
					case  16: O = "0X" + O; break;
					case   8: if(O.charAt(0) != "0") O =  "0" + O; break;
					case   2: O = "0b" + O; break;
				}
			}

			/* add sign character */
			if(sign && O.charAt(0) != "-") {
				if(flags.indexOf("+") > -1) O = "+" + O;
				else if(flags.indexOf(" ") > -1) O = " " + O;
			}
			/* width */
			if(width > 0) {
				if(O.length < width) {
					if(flags.indexOf("-") > -1) {
						O = O + ((width - O.length) >= 0 ?  " ".repeat((width - O.length)) : "");
					} else if(flags.indexOf("0") > -1 && prec < 0 && O.length > 0) {
						if(prec > O.length) O = ((prec - O.length) >= 0 ?  "0".repeat((prec - O.length)) : "") + O;
						pad = ((width - O.length) >= 0 ?  (prec > 0 ? " " : "0").repeat((width - O.length)) : "");
						if(O.charCodeAt(0) < 48) {
							if(O.charAt(2).toLowerCase() == "x") O = O.substr(0,3) + pad + O.substring(3);
							else O = O.substr(0,1) + pad + O.substring(1);
						}
						else if(O.charAt(1).toLowerCase() == "x") O = O.substr(0,2) + pad + O.substring(2);
						else O = pad + O;
					} else {
						O = ((width - O.length) >= 0 ?  " ".repeat((width - O.length)) : "") + O;
					}
				}
			}

		} else if(isnum > 0) {

			Vnum = Number(arg);
			if(arg === null) Vnum = 0/0;
			if(len == "L") bytes = 12;
			var isf/*:boolean*/ = isFinite(Vnum);
			if(!isf) { /* Infinity or NaN */
				if(Vnum < 0) O = "-";
				else if(flags.indexOf("+") > -1) O = "+";
				else if(flags.indexOf(" ") > -1) O = " ";
				O += (isNaN(Vnum)) ? "nan" : "inf";
			} else {
				var E/*:number*/ = 0;

				if(prec == -1 && isnum != 4) prec = 6;

				/* g/G conditional behavior */
				if(isnum == 3) {
					O = Vnum.toExponential(1);
					E = +O.substr(O.indexOf("e") + 1);
					if(prec === 0) prec = 1;
					if(prec > E && E >= -4) { isnum = (11); prec = prec -(E + 1); }
					else { isnum = (12); prec = prec - 1; }
				}

				/* sign: workaround for negative zero */
				var sg/*:string*/ = (Vnum < 0 || 1/Vnum == -Infinity) ? "-" : "";
				if(Vnum < 0) Vnum = -Vnum;

				switch(isnum) {
					/* f/F standard */
					case 1: case 11:
						if(Vnum < 1e21) {
							O = Vnum.toFixed(prec);
							if(isnum == 1) { if(prec===0 &&alt&& O.indexOf(".")==-1) O+="."; }
							else if(!alt) O=O.replace(/(\.\d*[1-9])0*$/,"$1").replace(/\.0*$/,"");
							else if(O.indexOf(".") == -1) O+= ".";
							break;
						}
						O = Vnum.toExponential(20);
						E = +O.substr(O.indexOf("e")+1);
						O = O.charAt(0) + O.substr(2,O.indexOf("e")-2);
						O = O + (E - O.length + 1 >= 0 ?  "0".repeat(E - O.length + 1) : "");
						if(alt || (prec > 0 && isnum !== 11)) O = O + "." + (prec >= 0 ?  "0".repeat(prec) : "");
						break;

					/* e/E exponential */
					case 2: case 12:
						O = Vnum.toExponential(prec);
						E = O.indexOf("e");
						if(O.length - E === 3) O = O.substr(0, E+2) + "0" + O.substr(E+2);
						if(alt && O.indexOf(".") == -1) O = O.substr(0,E) +"."+ O.substr(E);
						else if(!alt && isnum == 12) O = O.replace(/\.0*e/, "e").replace(/\.(\d*[1-9])0*e/, ".$1e");
						break;

					/* a/A hex */
					case 4:
						if(Vnum===0){O= "0x0"+((alt||prec>0)?"."+(prec >= 0 ? "0".repeat(prec) : ""):"")+"p+0"; break;}
						O = Vnum.toString(16);
						/* First char 0-9 */
						var ac/*:number*/ = O.charCodeAt(0);
						if(ac == 48) {
							ac = 2; E = -4; Vnum *= 16;
							while(O.charCodeAt(ac++) == 48) { E -= 4; Vnum *= 16; }
							O = Vnum.toString(16);
							ac = O.charCodeAt(0);
						}

						var ai/*:number*/ = O.indexOf(".");
						if(O.indexOf("(") > -1) {
							/* IE exponential form */
							var am/*:?Array<any>*/ = O.match(/\(e(.*)\)/);
							var ae/*:number*/ = am ? (+am[1]) : 0;
							E += 4 * ae; Vnum /= Math.pow(16, ae);
						} else if(ai > 1) {
							E += 4 * (ai - 1); Vnum /= Math.pow(16, ai - 1);
						} else if(ai == -1) {
							E += 4 * (O.length - 1); Vnum /= Math.pow(16, O.length - 1);
						}

						/* at this point 1 <= Vnum < 16 */

						if(bytes > 8) {
							if(ac < 50) { E -= 3; Vnum *= 8; }
							else if(ac < 52) { E -= 2; Vnum *= 4; }
							else if(ac < 56) { E -= 1; Vnum *= 2; }
							/* at this point 8 <= Vnum < 16 */
						} else {
							if(ac >= 56) { E += 3; Vnum /= 8; }
							else if(ac >= 52) { E += 2; Vnum /= 4; }
							else if(ac >= 50) { E += 1; Vnum /= 2; }
							/* at this point 1 <= Vnum < 2 */
						}

						O = Vnum.toString(16);
						if(O.length > 1) {
							if(O.length > prec+2 && O.charCodeAt(prec+2) >= 56) {
								var _f/*:boolean*/ = O.charCodeAt(0) == 102;
								O = (Vnum + 8 * Math.pow(16, -prec-1)).toString(16);
								if(_f && O.charCodeAt(0) == 49) E += 4;
							}
							if(prec > 0) {
								O = O.substr(0, prec + 2);
								if(O.length < prec + 2) {
									if(O.charCodeAt(0) < 48) O = O.charAt(0) + ((prec + 2 - O.length) >= 0 ?  "0".repeat((prec + 2 - O.length)) : "") + O.substr(1);
									else O += ((prec + 2 - O.length) >= 0 ?  "0".repeat((prec + 2 - O.length)) : "");
								}
							} else if(prec === 0) O = O.charAt(0) + (alt ? "." : "");
						} else if(prec > 0) O = O + "." + (prec >= 0 ? "0".repeat(prec) : "");
						else if(alt) O = O + ".";
						O = "0x" + O + "p" + (E>=0 ? "+" + E : E);
						break;
				}

				if(sg === "") {
					if(flags.indexOf("+") > -1) sg = "+";
					else if(flags.indexOf(" ") > -1) sg = " ";
				}

				O = sg + O;
			}

			/* width */
			if(width > O.length) {
				if(flags.indexOf("-") > -1) {
					O = O + ((width - O.length) >= 0 ?  " ".repeat((width - O.length)) : "");
				} else if(flags.indexOf("0") > -1 && O.length > 0 && isf) {
					pad = ((width - O.length) >= 0 ?  "0".repeat((width - O.length)) : "");
					if(O.charCodeAt(0) < 48) {
						if(O.charAt(2).toLowerCase() == "x") O = O.substr(0,3) + pad + O.substring(3);
						else O = O.substr(0,1) + pad + O.substring(1);
					}
					else if(O.charAt(1).toLowerCase() == "x") O = O.substr(0,2) + pad + O.substring(2);
					else O = pad + O;
				} else {
					O = ((width - O.length) >= 0 ?  " ".repeat((width - O.length)) : "") + O;
				}
			}
			if(c < 96) O = O.toUpperCase();

		}

		o += /*.push*/(O);
	}
	return o/*.join("")*/;
}

function vsprintf(fmt/*:string*/, args/*:Args*/)/*:string*/ { return doit(tokenize(fmt), args); }

function sprintf(/*:: ...argz*/)/*:string*/ {
	var args/*:Array<any>*/ = new Array(arguments.length - 1);
	for(var i/*:number*/ = 0; i < args.length; ++i) args[i] = arguments[i+1];
	return doit(tokenize(arguments[0]), args);
}





/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _rgb_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6);


class GFX {
    constructor(canvas) {
        this.canvas=canvas;
        this.context=this.canvas.getContext("2d");
        this.RGB=_rgb_js__WEBPACK_IMPORTED_MODULE_0__["default"];
        this.curColor=new this.RGB(0,0,0); 
        this.fps=60;
        this.offX=0; this.offY=0;
        this.width; this.height; this.scale;
        this.canvas.width;
	    this.canvas.height;
        this.scrnBuffer=[];
        this.setRes(240,180,3);
    }

    setRes(w,h,s) {
        this.width=w;
        this.height=h;
        this.scale=s
        this.canvas.width=this.width*this.scale;
	    this.canvas.height=this.height*this.scale;
        for (let y=0;y<this.height;y++) {
            this.scrnBuffer[y]=[];
            for (let x=0;x<this.width;x++) {
                this.scrnBuffer[y][x]=this.rgb(0,0,0);
            }
        }
    }

    tick() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height); //clears the canvas of the previous screen but does not reset the buffer
        for (let y=0;y<this.height;y++) { //Draw the buffer to the screen
            for (let x=0;x<this.width;x++) {
                this.context.fillStyle=this.scrnBuffer[y][x].toString(); //weird css conversion
                this.context.fillRect(x*this.scale,y*this.scale,this.scale,this.scale);
            }
        }
    }

    cls() { //Resets the buffer
        this.cam(0,0);
        this.color(this.rgb(0,0,0));
        for (let y=0;y<this.height;y++) {
            for (let x=0;x<this.width;x++) {
                this.pset(x,y);
            }
        }
    }
    
    rectFill(x,y,w,h) {
        for (let ry=0;ry<h;ry++) {
            for (let rx=0;rx<w;rx++) {
                this.pset(rx+x,ry+y);
            }
        }
    }
    
    rectStrk(x,y,w,h) {
        for (let ry=0;ry<h;ry++) {
            for (let rx=0;rx<w;rx++) {
                if (rx==0 || ry==0 || rx==w-1 || ry==h-1) {
                    this.pset(rx+x,ry+y);
                }
            }
        }
    }
    
    pset(x,y) { //Sets a pixel to a color
        x-=this.offsetX;
        y-=this.offsetY;
    
        if (x>=0 && x<this.width && y>=0 && y<this.height) {
            this.scrnBuffer[y][x]=this.curColor;
        }
    }
    
    rgb(r,g,b) {
        return new _rgb_js__WEBPACK_IMPORTED_MODULE_0__["default"](r,g,b);
    }

    color(c) { //Sets the current color
        this.curColor=c;
    }
    
    cam(x,y) { //Offsets the cursor
        this.offsetX=x;
        this.offsetY=y;
    }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GFX);

/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class RGB {
    constructor(r,g,b){
        this.r=r;
        this.g=g;
        this.b=b;
    }
    
    toString(){
        return "rgb("+this.r+" "+this.g+" "+this.b+")";
    }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (RGB);

/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const fileSystem = { 
    read:function(url){
        let http = new XMLHttpRequest();
        http.open('GET', url, false);
        http.send();
        return http.response
    },

    exists:function(url){
        let http = new XMLHttpRequest();
        http.open('HEAD', url, false);
        http.send();
        return http.status!=404;
    }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (fileSystem);

/***/ }),
/* 8 */
/***/ ((module) => {

"use strict";
// 'path' module extracted from Node.js v8.11.1 (only the posix part)
// transplited with Babel

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



function assertPath(path) {
  if (typeof path !== 'string') {
    throw new TypeError('Path must be a string. Received ' + JSON.stringify(path));
  }
}

// Resolves . and .. elements in a path with directory names
function normalizeStringPosix(path, allowAboveRoot) {
  var res = '';
  var lastSegmentLength = 0;
  var lastSlash = -1;
  var dots = 0;
  var code;
  for (var i = 0; i <= path.length; ++i) {
    if (i < path.length)
      code = path.charCodeAt(i);
    else if (code === 47 /*/*/)
      break;
    else
      code = 47 /*/*/;
    if (code === 47 /*/*/) {
      if (lastSlash === i - 1 || dots === 1) {
        // NOOP
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 /*.*/ || res.charCodeAt(res.length - 2) !== 46 /*.*/) {
          if (res.length > 2) {
            var lastSlashIndex = res.lastIndexOf('/');
            if (lastSlashIndex !== res.length - 1) {
              if (lastSlashIndex === -1) {
                res = '';
                lastSegmentLength = 0;
              } else {
                res = res.slice(0, lastSlashIndex);
                lastSegmentLength = res.length - 1 - res.lastIndexOf('/');
              }
              lastSlash = i;
              dots = 0;
              continue;
            }
          } else if (res.length === 2 || res.length === 1) {
            res = '';
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0)
            res += '/..';
          else
            res = '..';
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0)
          res += '/' + path.slice(lastSlash + 1, i);
        else
          res = path.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code === 46 /*.*/ && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}

function _format(sep, pathObject) {
  var dir = pathObject.dir || pathObject.root;
  var base = pathObject.base || (pathObject.name || '') + (pathObject.ext || '');
  if (!dir) {
    return base;
  }
  if (dir === pathObject.root) {
    return dir + base;
  }
  return dir + sep + base;
}

var posix = {
  // path.resolve([from ...], to)
  resolve: function resolve() {
    var resolvedPath = '';
    var resolvedAbsolute = false;
    var cwd;

    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path;
      if (i >= 0)
        path = arguments[i];
      else {
        if (cwd === undefined)
          cwd = process.cwd();
        path = cwd;
      }

      assertPath(path);

      // Skip empty entries
      if (path.length === 0) {
        continue;
      }

      resolvedPath = path + '/' + resolvedPath;
      resolvedAbsolute = path.charCodeAt(0) === 47 /*/*/;
    }

    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)

    // Normalize the path
    resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);

    if (resolvedAbsolute) {
      if (resolvedPath.length > 0)
        return '/' + resolvedPath;
      else
        return '/';
    } else if (resolvedPath.length > 0) {
      return resolvedPath;
    } else {
      return '.';
    }
  },

  normalize: function normalize(path) {
    assertPath(path);

    if (path.length === 0) return '.';

    var isAbsolute = path.charCodeAt(0) === 47 /*/*/;
    var trailingSeparator = path.charCodeAt(path.length - 1) === 47 /*/*/;

    // Normalize the path
    path = normalizeStringPosix(path, !isAbsolute);

    if (path.length === 0 && !isAbsolute) path = '.';
    if (path.length > 0 && trailingSeparator) path += '/';

    if (isAbsolute) return '/' + path;
    return path;
  },

  isAbsolute: function isAbsolute(path) {
    assertPath(path);
    return path.length > 0 && path.charCodeAt(0) === 47 /*/*/;
  },

  join: function join() {
    if (arguments.length === 0)
      return '.';
    var joined;
    for (var i = 0; i < arguments.length; ++i) {
      var arg = arguments[i];
      assertPath(arg);
      if (arg.length > 0) {
        if (joined === undefined)
          joined = arg;
        else
          joined += '/' + arg;
      }
    }
    if (joined === undefined)
      return '.';
    return posix.normalize(joined);
  },

  relative: function relative(from, to) {
    assertPath(from);
    assertPath(to);

    if (from === to) return '';

    from = posix.resolve(from);
    to = posix.resolve(to);

    if (from === to) return '';

    // Trim any leading backslashes
    var fromStart = 1;
    for (; fromStart < from.length; ++fromStart) {
      if (from.charCodeAt(fromStart) !== 47 /*/*/)
        break;
    }
    var fromEnd = from.length;
    var fromLen = fromEnd - fromStart;

    // Trim any leading backslashes
    var toStart = 1;
    for (; toStart < to.length; ++toStart) {
      if (to.charCodeAt(toStart) !== 47 /*/*/)
        break;
    }
    var toEnd = to.length;
    var toLen = toEnd - toStart;

    // Compare paths to find the longest common path from root
    var length = fromLen < toLen ? fromLen : toLen;
    var lastCommonSep = -1;
    var i = 0;
    for (; i <= length; ++i) {
      if (i === length) {
        if (toLen > length) {
          if (to.charCodeAt(toStart + i) === 47 /*/*/) {
            // We get here if `from` is the exact base path for `to`.
            // For example: from='/foo/bar'; to='/foo/bar/baz'
            return to.slice(toStart + i + 1);
          } else if (i === 0) {
            // We get here if `from` is the root
            // For example: from='/'; to='/foo'
            return to.slice(toStart + i);
          }
        } else if (fromLen > length) {
          if (from.charCodeAt(fromStart + i) === 47 /*/*/) {
            // We get here if `to` is the exact base path for `from`.
            // For example: from='/foo/bar/baz'; to='/foo/bar'
            lastCommonSep = i;
          } else if (i === 0) {
            // We get here if `to` is the root.
            // For example: from='/foo'; to='/'
            lastCommonSep = 0;
          }
        }
        break;
      }
      var fromCode = from.charCodeAt(fromStart + i);
      var toCode = to.charCodeAt(toStart + i);
      if (fromCode !== toCode)
        break;
      else if (fromCode === 47 /*/*/)
        lastCommonSep = i;
    }

    var out = '';
    // Generate the relative path based on the path difference between `to`
    // and `from`
    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
      if (i === fromEnd || from.charCodeAt(i) === 47 /*/*/) {
        if (out.length === 0)
          out += '..';
        else
          out += '/..';
      }
    }

    // Lastly, append the rest of the destination (`to`) path that comes after
    // the common path parts
    if (out.length > 0)
      return out + to.slice(toStart + lastCommonSep);
    else {
      toStart += lastCommonSep;
      if (to.charCodeAt(toStart) === 47 /*/*/)
        ++toStart;
      return to.slice(toStart);
    }
  },

  _makeLong: function _makeLong(path) {
    return path;
  },

  dirname: function dirname(path) {
    assertPath(path);
    if (path.length === 0) return '.';
    var code = path.charCodeAt(0);
    var hasRoot = code === 47 /*/*/;
    var end = -1;
    var matchedSlash = true;
    for (var i = path.length - 1; i >= 1; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          if (!matchedSlash) {
            end = i;
            break;
          }
        } else {
        // We saw the first non-path separator
        matchedSlash = false;
      }
    }

    if (end === -1) return hasRoot ? '/' : '.';
    if (hasRoot && end === 1) return '//';
    return path.slice(0, end);
  },

  basename: function basename(path, ext) {
    if (ext !== undefined && typeof ext !== 'string') throw new TypeError('"ext" argument must be a string');
    assertPath(path);

    var start = 0;
    var end = -1;
    var matchedSlash = true;
    var i;

    if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
      if (ext.length === path.length && ext === path) return '';
      var extIdx = ext.length - 1;
      var firstNonSlashEnd = -1;
      for (i = path.length - 1; i >= 0; --i) {
        var code = path.charCodeAt(i);
        if (code === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else {
          if (firstNonSlashEnd === -1) {
            // We saw the first non-path separator, remember this index in case
            // we need it if the extension ends up not matching
            matchedSlash = false;
            firstNonSlashEnd = i + 1;
          }
          if (extIdx >= 0) {
            // Try to match the explicit extension
            if (code === ext.charCodeAt(extIdx)) {
              if (--extIdx === -1) {
                // We matched the extension, so mark this as the end of our path
                // component
                end = i;
              }
            } else {
              // Extension does not match, so our result is the entire path
              // component
              extIdx = -1;
              end = firstNonSlashEnd;
            }
          }
        }
      }

      if (start === end) end = firstNonSlashEnd;else if (end === -1) end = path.length;
      return path.slice(start, end);
    } else {
      for (i = path.length - 1; i >= 0; --i) {
        if (path.charCodeAt(i) === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // path component
          matchedSlash = false;
          end = i + 1;
        }
      }

      if (end === -1) return '';
      return path.slice(start, end);
    }
  },

  extname: function extname(path) {
    assertPath(path);
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;
    for (var i = path.length - 1; i >= 0; --i) {
      var code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1)
            startDot = i;
          else if (preDotState !== 1)
            preDotState = 1;
      } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      return '';
    }
    return path.slice(startDot, end);
  },

  format: function format(pathObject) {
    if (pathObject === null || typeof pathObject !== 'object') {
      throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
    }
    return _format('/', pathObject);
  },

  parse: function parse(path) {
    assertPath(path);

    var ret = { root: '', dir: '', base: '', ext: '', name: '' };
    if (path.length === 0) return ret;
    var code = path.charCodeAt(0);
    var isAbsolute = code === 47 /*/*/;
    var start;
    if (isAbsolute) {
      ret.root = '/';
      start = 1;
    } else {
      start = 0;
    }
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    var i = path.length - 1;

    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;

    // Get non-dir info
    for (; i >= start; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) startDot = i;else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
    // We saw a non-dot character immediately before the dot
    preDotState === 0 ||
    // The (right-most) trimmed path component is exactly '..'
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      if (end !== -1) {
        if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);else ret.base = ret.name = path.slice(startPart, end);
      }
    } else {
      if (startPart === 0 && isAbsolute) {
        ret.name = path.slice(1, startDot);
        ret.base = path.slice(1, end);
      } else {
        ret.name = path.slice(startPart, startDot);
        ret.base = path.slice(startPart, end);
      }
      ret.ext = path.slice(startDot, end);
    }

    if (startPart > 0) ret.dir = path.slice(0, startPart - 1);else if (isAbsolute) ret.dir = '/';

    return ret;
  },

  sep: '/',
  delimiter: ':',
  win32: null,
  posix: null
};

posix.posix = posix;

module.exports = posix;


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _game_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);


window.onload=()=>{
	const canvas=document.getElementById("output");

	var script="main.lua"

	var game=new _game_js__WEBPACK_IMPORTED_MODULE_0__["default"](canvas,script);
}

})();

/******/ })()
;