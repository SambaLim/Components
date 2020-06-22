"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var SpecialSelect = function SpecialSelect(rootElement) {
  /* DOM */
  this.rootElement = rootElement;
  this.resultListEl;
  this.selectEl;
  this.inputEl;
  this.addButtonEl;
  /* Data */

  this.fullDataList = [];
  this.resultList = [];
  /* Number(id) */

  this.seq = 100;
};

SpecialSelect.prototype.init = function (props) {
  var _this = this;

  var dataList = props.dataList;
  var divEl = document.createElement('div');
  divEl.id = "divEl";
  var selectEl = document.createElement('select');
  selectEl.id = "selectEl";
  selectEl.multiple = true;
  selectEl.style.display = "none";
  var areaButtonEl = document.createElement('div');
  areaButtonEl.id = "areaButtonEl";
  var inputEl = document.createElement('input');
  inputEl.id = "inputEl";
  inputEl.type = 'text';
  var addButtonEl = document.createElement('button');
  addButtonEl.id = "addButtonEl";
  addButtonEl.innerText += '>';
  var resultListEl = document.createElement('ul');
  resultListEl.id = "resultListEl";
  this.resultListEl = resultListEl;
  this.selectEl = selectEl;
  this.inputEl = inputEl;
  this.addButtonEl = addButtonEl;

  if (dataList) {
    this.fullDataList = dataList;
    this.setSelectOptions(dataList);
  }

  this.addButtonEl.addEventListener('click', function (event) {
    var newStatus = _this.isNewWithId(_this.selectEl.value);

    if (_this.selectEl.style.display == 'none') return;

    if (_this.selectEl.value == "" || newStatus) {
      _this.pushDirectResultList(_this.selectEl.firstChild.text);

      _this.inputEl.value = "";
      return;
    }

    _this.pushResultList(_this.selectEl.value);

    _this.inputEl.value = "";
  });
  this.inputEl.addEventListener('keyup', function (event) {
    var value = inputEl.value;

    var validate = _this.validateInputValue(value);

    if (validate) {
      console.warn('특수문자를 입력할 수는 없습니다.');
      _this.inputEl.value = "";

      _this.inputEl.focus();

      return;
    }

    var filterList = _this.filterFullDataList(value);

    if (event.keyCode === 40) {
      _this.selectEl.focus();
    } else if (event.keyCode === 13) {
      _this.pushDirectResultList(value);

      value = "";
    }

    _this.setSelectOptions(filterList);

    if (value.length) {
      _this.selectEl.style.display = "";
    } else {
      _this.selectEl.style.display = "none";
      _this.selectEl.value = _this.selectEl.firstChild.value;
    }
  });
  this.selectEl.addEventListener('dblclick', function (event) {
    var newStatus = _this.isNewWithId(_this.selectEl.value);

    if (newStatus) {
      _this.pushDirectResultList(_this.selectEl.firstChild.text);
    } else {
      _this.pushResultList(event.target.value);
    }

    _this.selectEl.style.display = "none";
    _this.inputEl.value = "";
  });
  this.selectEl.addEventListener('keyup', function (event) {
    if (event.keyCode === 13) {
      _this.pushResultList(_this.selectEl.value);
    }
  });
  areaButtonEl.appendChild(inputEl);
  areaButtonEl.appendChild(addButtonEl);
  divEl.appendChild(areaButtonEl);
  divEl.appendChild(selectEl); // this.rootElement.appendChild(areaButtonEl);

  this.rootElement.appendChild(divEl);
  this.rootElement.appendChild(resultListEl);
};

SpecialSelect.prototype.validateInputValue = function (value) {
  var re = /[<>%&\'\"]/gi;
  return re.test(value);
};

SpecialSelect.prototype.filterFullDataList = function (value) {
  if (typeof value != 'string') value = '' + value;
  var re = new RegExp(value);
  var tempValue = {
    id: this.seq++,
    title: value
  };

  var correctList = _toConsumableArray(this.fullDataList).filter(function (correct, index) {
    return re.test(correct.title);
  });

  var firstCorrectList = _toConsumableArray(correctList).filter(function (first, index) {
    var word = first.title.slice(value.length);
    return !re.test(word);
  });

  var restFirstCorrectList = _toConsumableArray(correctList).filter(function (first, index) {
    var word = first.title.slice(value.length);
    return re.test(word);
  });

  var notCorrectList = _toConsumableArray(this.fullDataList).filter(function (notCorrect, index) {
    return !re.test(notCorrect.title);
  });

  if (notCorrectList.length === this.fullDataList.length) {
    return [tempValue].concat(_toConsumableArray(firstCorrectList), _toConsumableArray(restFirstCorrectList), _toConsumableArray(notCorrectList));
  }

  return [].concat(_toConsumableArray(firstCorrectList), _toConsumableArray(restFirstCorrectList), _toConsumableArray(notCorrectList));
};

SpecialSelect.prototype.setSelectOptions = function (dataList) {
  var _this2 = this;

  while (this.selectEl.firstChild) {
    this.selectEl.removeChild(this.selectEl.lastChild);
  }

  dataList.forEach(function (value, index) {
    var id = value.id,
        title = value.title;
    var optionEl = document.createElement('option');
    optionEl.value = id;
    optionEl.text = title;

    _this2.selectEl.appendChild(optionEl);
  });
};

SpecialSelect.prototype.pushResultList = function (id) {
  var value;
  this.fullDataList.forEach(function (data, index) {
    if (data.id == id) value = data;
  });
  if (!value) return;
  var status = true;
  this.resultList.forEach(function (result, index) {
    if (result.id === value.id || result.title == value.title) status = false;
  });
  if (status) this.resultList = [value].concat(_toConsumableArray(this.resultList));
  this.setResultListEl();
};

SpecialSelect.prototype.setResultListEl = function () {
  var _this3 = this;

  while (this.resultListEl.firstChild) {
    this.resultListEl.removeChild(this.resultListEl.lastChild);
  }

  var list = this.filterSpace(this.resultList);
  if (list.length === 0) this.resultListEl.style.visibility = 'hidden';
  list.forEach(function (result, index) {
    var liEl = document.createElement('li');
    liEl.className = "badge";
    var textEl = document.createElement('span');
    textEl.className = "badgeText";
    var buttonEl = document.createElement('button');
    buttonEl.innerText += 'x';
    buttonEl.className = "badgeDeleteButton";
    buttonEl.addEventListener('click', function () {
      _this3.deleteResult(result);
    });
    textEl.innerHTML += result.title;
    liEl.appendChild(textEl);
    liEl.appendChild(buttonEl);

    _this3.resultListEl.appendChild(liEl);
  });
  this.resultListEl.style.visibility = 'visible';
  this.inputEl.value = "";
  this.inputEl.focus();
};

SpecialSelect.prototype.pushDirectResultList = function (value) {
  var result;
  this.fullDataList.forEach(function (data, index) {
    if (data.title == value) result = data;
  });

  if (!result) {
    result = {
      id: this.seq++,
      title: value
    };
    var duplicate = false;
    this.resultList.forEach(function (r, index) {
      if (r.title == result.title) duplicate = true;
    });

    if (!duplicate) {
      result.new = true;
      this.resultList = [result].concat(_toConsumableArray(this.resultList));
    }

    this.setResultListEl();
  } else {
    this.pushResultList(result.id);
  }
};

SpecialSelect.prototype.deleteResult = function (value) {
  this.resultList = _toConsumableArray(this.resultList).filter(function (result, index) {
    return !(result.id === value.id);
  });
  this.setResultListEl();
};

SpecialSelect.prototype.filterSpace = function (list) {
  return _toConsumableArray(list).filter(function (value) {
    return value.title.trim() != "";
  });
};

SpecialSelect.prototype.getResultList = function () {
  return this.filterSpace(this.resultList);
};

SpecialSelect.prototype.isNewWithId = function (id) {
  var value;
  this.fullDataList.forEach(function (data, index) {
    if (data.id == id) value = data;
  });
  return value ? false : true;
};
