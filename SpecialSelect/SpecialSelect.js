const SpecialSelect = function(rootElement) {
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
}

SpecialSelect.prototype.init = function(props) {

  const { dataList, resultList } = props;

  const divEl = document.createElement('div');
  divEl.id = "divEl";
  const selectEl = document.createElement('select');
  selectEl.id = "selectEl";
  selectEl.multiple = true;
  selectEl.style.display = "none";

  const areaButtonEl = document.createElement('div');
  areaButtonEl.id = "areaButtonEl";
  const inputEl = document.createElement('input');
  inputEl.id = "inputEl";
  inputEl.type = 'text';
  const addButtonEl = document.createElement('button');
  addButtonEl.id = "addButtonEl";
  addButtonEl.innerText += '>';

  const resultListEl = document.createElement('ul');
  resultListEl.id = "resultListEl";

  this.resultListEl = resultListEl;
  this.selectEl = selectEl;
  this.inputEl = inputEl;
  this.addButtonEl = addButtonEl;

  if(dataList) {
    this.fullDataList = dataList;
    this.setSelectOptions(dataList);
  }

  if(resultList) {
    this.setResultList(resultList);
  }

  this.addButtonEl.addEventListener('click', (event) => {

    const newStatus = this.isNewWithId(this.selectEl.value);

    if(this.selectEl.style.display == 'none') return;
    if(this.selectEl.value == "" || newStatus) {
      this.pushDirectResultList(this.selectEl.firstChild.text);
      this.inputEl.value = "";
      return;
    }

    this.pushResultList(this.selectEl.value);
    this.inputEl.value = "";
  });

  this.inputEl.addEventListener('keyup', (event) => {
    let { value } = inputEl;
    const validate = this.validateInputValue(value);

    if(validate) {
      console.warn('특수문자를 입력할 수는 없습니다.');
      this.inputEl.value = "";
      this.inputEl.focus();
      return;
    }

    const filterList = this.filterFullDataList(value);
    if(event.keyCode === 40) {
      this.selectEl.focus();
    } else if(event.keyCode === 13) {
      this.pushDirectResultList(value);
      value = "";
    }

    this.setSelectOptions(filterList);
    if(value.length) {
      this.selectEl.style.display = "";
    } else {
      this.selectEl.style.display = "none";
      this.selectEl.value = this.selectEl.firstChild.value;
    }
  });

  this.selectEl.addEventListener('dblclick', (event) => {

    const newStatus = this.isNewWithId(this.selectEl.value);

    if(newStatus) {
      this.pushDirectResultList(this.selectEl.firstChild.text);
    } else {
      this.pushResultList(event.target.value);
    }
    this.selectEl.style.display = "none";
    this.inputEl.value = "";
  });

  this.selectEl.addEventListener('keyup', (event) => {
    if(event.keyCode === 13) {
      this.pushResultList(this.selectEl.value);
    }
  });

  areaButtonEl.appendChild(inputEl);
  areaButtonEl.appendChild(addButtonEl);

  divEl.appendChild(areaButtonEl);
  divEl.appendChild(selectEl);

  // this.rootElement.appendChild(areaButtonEl);
  this.rootElement.appendChild(divEl);
  this.rootElement.appendChild(resultListEl);
}

SpecialSelect.prototype.validateInputValue = function(value) {
  const re = /[<>%&\'\"]/gi;
  return re.test(value);
}

SpecialSelect.prototype.filterFullDataList = function(value) {

  if(typeof value != 'string') value = ''+value;
  const re = new RegExp(value);
  const tempValue = {
    id: this.seq++,
    title: value
  }

  const correctList = [...this.fullDataList].filter((correct, index) => {
    return re.test(correct.title);
  });
  const firstCorrectList = [...correctList].filter((first, index) => {
    const word = first.title.slice(value.length);
    return !re.test(word);
  });
  const restFirstCorrectList = [...correctList].filter((first, index) => {
    const word = first.title.slice(value.length);
    return re.test(word);
  });
  const notCorrectList = [...this.fullDataList].filter((notCorrect, index) => {
    return !re.test(notCorrect.title);
  });

  if(notCorrectList.length === this.fullDataList.length) {
    return [tempValue, ...firstCorrectList, ...restFirstCorrectList, ...notCorrectList];
  }

  return [...firstCorrectList, ...restFirstCorrectList, ...notCorrectList];
}

SpecialSelect.prototype.setSelectOptions = function(dataList) {

  while(this.selectEl.firstChild) {
    this.selectEl.removeChild(this.selectEl.lastChild);
  }

  dataList.forEach((value, index) => {
    const { id, title } = value;
    const optionEl = document.createElement('option');
    optionEl.value = id;
    optionEl.text = title;

    this.selectEl.appendChild(optionEl);
  });
}

SpecialSelect.prototype.pushResultList = function(id) {

  let value;
  this.fullDataList.forEach((data, index) => {
    if(data.id == id) value = data;
  });

  if(!value) return;

  let status = true;
  this.resultList.forEach((result, index) => {
    if(result.id === value.id || result.title == value.title) status = false;
  });

  if(status) this.resultList = [value, ...this.resultList];
  this.setResultListEl();
}

SpecialSelect.prototype.setResultListEl = function() {

  while(this.resultListEl.firstChild) {
    this.resultListEl.removeChild(this.resultListEl.lastChild);
  }

  const list = this.filterSpace(this.resultList)
  if(list.length === 0) this.resultListEl.style.visibility = 'hidden';

  list.forEach((result, index) => {
    const liEl = document.createElement('li');
    liEl.className = "badge";
    const textEl = document.createElement('span');
    textEl.className =  "badgeText";
    const buttonEl = document.createElement('button');
    buttonEl.innerText += 'x';
    buttonEl.className = "badgeDeleteButton";
    buttonEl.addEventListener('click', () => {
      this.deleteResult(result);
    });
    textEl.innerHTML += result.title;

    liEl.appendChild(textEl);
    liEl.appendChild(buttonEl);
    this.resultListEl.appendChild(liEl);
  });

  this.resultListEl.style.visibility = 'visible';
  this.inputEl.value = "";
  this.inputEl.focus();
}

SpecialSelect.prototype.pushDirectResultList = function(value) {

  let result;
  this.fullDataList.forEach((data, index) => {
    if(data.title == value) result = data;
  });
      
  if(!result) {
    result = { id: this.seq++, title: value }
    let duplicate = false;
    this.resultList.forEach((r, index) => {
      if(r.title == result.title) duplicate = true;
    });
    if(!duplicate)  {
      result.new = true;
      this.resultList = [result, ...this.resultList];
    }
    this.setResultListEl();
  } else {
    this.pushResultList(result.id);
  }
}

SpecialSelect.prototype.deleteResult = function(value) {
  this.resultList = [...this.resultList].filter((result, index) => !(result.id === value.id));
  this.setResultListEl();
}

SpecialSelect.prototype.filterSpace = function(list) {
  return [...list].filter(value => {
    return value.title.trim() != "";
  });
}

SpecialSelect.prototype.isNewWithId = function(id) {
  
  let value;
  this.fullDataList.forEach((data, index) => {
    if(data.id == id) value = data;
  });

  return value ? false : true;
}

SpecialSelect.prototype.setResultList = function(list) {
  this.resultList = list;
  this.setResultListEl();
}

SpecialSelect.prototype.getResultList = function() {
  return this.filterSpace(this.resultList);
}