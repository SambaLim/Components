# SpecialSelect

> SearchBox에서 값을 입력하였을 때, 이를 뱃지로 바꿉니다.

![](https://i.imgur.com/rfAeDuJ.gif)

## 🎲 사용법

- 사용되는 각 데이터는 Object로 `{ id: 'seq01', title: '이름' }` 형식입니다.

- `new` 연산자를 사용하여 `SpecialSelect` 를 인스턴스화 합니다.
```
const rootEl = document.querySelector('#root');
const specialSelect = new SpecialSelect(rootEl);
```

- `init` 메소드로 실행합니다.
- Parameter로 `Object`를 받으며, 각 속성은 아래와 같습니다.
  - `dataList`는 Select에서 검색되는 목록을 의미합니다.
  - `resultList`는 우측 결과뱃지에 추가되는 목록을 의마합니다.

## 🧯 IE 지원

`SpecialSelect`는 IE도 지원합니다.
`Bundle.js`를 사용하시면 IE에서 사용이 가능합니다.