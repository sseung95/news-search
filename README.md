# search-news-project

news api를 이용하여 뉴스를 검색하고, 검색한 단어에 따른 검색 결과를 보여주는 프로젝트입니다.

- 원하는 기사를 Clip 해두고 확인할 수 있습니다.
- 최근 검색어를 5개까지 보여줍니다.
  <br /><br />

## 실제 구현 화면

<div display="flex">
	<img src="https://user-images.githubusercontent.com/98930796/174970343-31aa9dd8-8cdc-48b7-99f3-9c1e649649c4.gif" width="500" />
	<img src="https://user-images.githubusercontent.com/98930796/174970758-3efa6213-e228-4ff1-8ff3-89a276b61236.gif" width="500"/>
</div>
<br /><br />

## 팀원 및 역할

- 방예서, 전찬민 : Input, History

- 김승원, 김보우, 임수빈 : Header, List, ListItem, Clip
  <br /><br />

## 기간

2022.06.13 ~ 2022.06.22
<br /><br />

## 기술 스택

- React

- Redux-toolkit

- Styled-Components

- Git Flow
  <br /><br />

## 🤙 commit-convention

```
💡 Prefix
    ex) [ Feat ] 사용
```

- **Feat** : 새로운 기능 추가

- **Modify** : 기능 관련 코드 수정 (새로운 기능 추가 이외)

- **Fix** : 버그 픽스

- **Docs** : 문서 수정

- **Style** : 포맷, 세미콜론 수정, Optimize import, Code clean up 등 코드가 아닌 스타일에 관련된 수정

- **Refactor** : 코드 리펙토링

- **Test** : 테스트 코드 추가

- **Chore** : 빌드 관련 업무 수정(안드로이드의 경우 builde.gradle, manifest)

- **Add** : 파일 추가

- **Del** : 파일 삭제

- **Design** : css 수정했을 때

- **Rename** : 파일 혹은 폴더명을 수정하거나 옮기는 작업만인 경우

- **Comment** : 필요한 주석 추가 및 변경

- **Conf** : 환경설정 관련
  <br /><br />

## 컴포넌트별 기능

- Header

  ```
  - UI
    버튼 2개, ( Home, Clip )

  - Routing
    Home -> "/"
    Clip -> "/clip"
    그 외 url은 "/"로 redirect
  ```

- Input

  ```
  1. JSX input
    - input value가 있는 경우 검색 api호출 (마지막 타이핑 이후 0.5초 동안 추가 입력이 없다면)
    - focus중이면 search history 노출

  2. Search history
    - 최대 5개까지 search history 저장
      store에서 조건 처리하고 dispatch하기
    - persist 사용하여 브라우저 종료해도 최근 검색어 데이터 유지

  + 🚩검색 후 최근 검색 기록 화면에서 사라지고,
      focus될 경우 최근 검색 기록 다시 나타나는 UI 추가
  ```

- List

  ```
  1. infinite scroll (스크롤이 마지막에 닿았을 때 다음 page 요청)

  2. 첫 페이지가 화면의 높이를 모두 채우지 못한 경우에도 page 요청

  + 🚩Loading UI 추가
      axios가 호출 되는 시간동안 Loading gif 보여줌

  + 🚩Error Message 추가
      에러 발생시 에러 문구 추가
  ```

  <p align="center"><img src="https://user-images.githubusercontent.com/80630505/174981201-3d435590-f5c4-4f96-b9ab-ff48b558c2aa.png" width="500"/></p>

- ListItem

  ```
  - UI
  제목, 발행일, 버튼 2개(Clip/Clipped, See detail)

  - clip
  사용자가 다시 검색할 때 Clip한 item은 Clipped으로 구현
  ```

- Clip

  ```
  - store에 저장된 clip 배열을 map으로 돌려서 출력하기

  - clipSlice.js 작성하기
  ```

  <br /><br />

## 구현 상세

### 🔹**Reducer**

- searchSlice

  - redux-persist를 활용하여 localStorage 에 저장

  - 검색어 조건(최대 5개, 똑같은 단어 검색시 최근 상태로 올리기) 처리 후 상태를 update하는 action을 작성 후, 입력된 검색어를 dispatch
    - 현재 keyword list가 최대 개수(5개)이면 새 값과 마지막 값을 제외한 배열로 return

    - 현재 keyword list에 이미 같은 값이 있으면 그 값을 삭제하고 새 값을 맨 앞에 넣은 배열을 return

- clipSlice

  1. clip된 기사 list를 [배열]에 담아 전역으로 저장하여 사용

  2. redux-persist를 활용하여 localStorage 에 저장하고, state가 변경되면 자동으로 update

     - action 1 : clip 된 기사 추가 (clipItem)

       추가된 기사의 정보 (id, title, date, url) 를 action.payload 로 받아 clip list 배열에 추가

     - action 2 : unClip 된 기사 삭제 (unclipItem)
       filter method 를 사용하여 id 를 비교하여 해당 기사만 삭제된 새로운 배열을 다음 state 로 return
       ```jsx
       state.filter((el) => el.id !== action.payload.id);
       ```

### 🔹**Send Search Keyword**

1. EventListener(onChange)를 이용하여 사용자가 입력하는 검색어를 받아옴

1. 검색어를 가지고 API 호출을 위해 검색어를 Lift up 하여 전달

1. 그리고 0.5초 뒤에 검색어를 보내는 동작을 하기 위하여 setTimeout 함수로 delay 값을 설정

1. 타이핑이 끝났음을 처리하기 위해 useEffect의 cleanup 함수를 이용

### 🔹**Responsive & Infinite Scroll**

1. `useInView`를 이용해서 List 마지막에 item에 ref를 설정

1. ref가 설정된 item이 화면에 보여지게 되면, axios를 이용해 다음 페이지를 호출 <br />
   \+ axios를 호출할 때 중복 호출을 방지하기 위해서 Loading State 추가 <br />
   \+ 화면에 List가 꽉 차지 않은 경우에도 다음 페이지를 호출

### 🔹**useNewsSearch**

- 가독성을 높이기 위해 axios 호출하는 코드를 Custom Hook으로 정의
