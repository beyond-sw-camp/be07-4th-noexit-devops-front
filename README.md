<div align=center>	

# NoEixt
방탈출 만을 고려하는 찐 방탈출러 덕후들을 위한 커뮤니티

![logo](https://github.com/user-attachments/assets/94222722-5b34-46c6-aa91-08ba3cbc936e)

<br/>

## 🙋🏻팀원

| **김민성** | **김민지** | **박수현** | **이명규** |
| :------: |  :------: | :------: | :------: |
| [<img src="https://avatars.githubusercontent.com/Windowmincastle" height=150 width=150> <br/> @Windowmincastle](https://github.com/Windowmincastle) | [<img src="https://avatars.githubusercontent.com/epiuwiruiw" height=150 width=150> <br/> @epiuwiruiw](https://github.com/epiuwiruiw) | [<img src="https://avatars.githubusercontent.com/34suuuuu" height=150 width=150> <br/> @34suuuuu](https://github.com/34suuuuu) | [<img src="https://avatars.githubusercontent.com/leem5514" height=150 width=150> <br/> @leem5514](https://github.com/leem5514) |

<br/>

## 📢 프로젝트 소개

<br/>

## 💡 프로젝트 배경 및 필요성


<br/>

## 🛠 기술 스택

###  DB
![mariadb](https://img.shields.io/badge/mariadb-003545?style=for-the-badge&logo=mariadb&logoColor=white)
![redis](https://img.shields.io/badge/redis-FF4438?style=for-the-badge)
![amazons3](https://img.shields.io/badge/amazons3-569A31?style=for-the-badge&logo=amazons3&logoColor=white)

### BACKEND
![Java](https://img.shields.io/badge/java-007396?style=for-the-badge&logo=java&logoColor=white)
![Spring](https://img.shields.io/badge/spring-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
![socketdotio](https://img.shields.io/badge/socketdotio-010101?style=for-the-badge&logo=socketddotio&logoColor=white)

### FRONTEND
![Vue.js](https://img.shields.io/badge/vue.js-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![vuetify](https://img.shields.io/badge/vuetify-1867C0?style=for-the-badge&logo=vuetify&logoColor=white)

### TOOLS
![Notion](https://img.shields.io/badge/notion-181717?style=for-the-badge&logo=notion&logoColor=white)
![Git](https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/Github-181717?style=for-the-badge&logo=Github&logoColor=white)
![figma](https://img.shields.io/badge/figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white)


<br/>

## 🗓️ WBS
<img src="./img/WBS.png" alt="개발일정(WBS)" width="1000" height="500"/>

[🗓️ WBS](https://docs.google.com/spreadsheets/d/1VdXKl6pfghy9OK6zTpShCHeG1uyAGB85Y2ycm1viF5g/edit?gid=1200936578#gid=1200936578)


<br/>

## 📝 요구사항정의서
[2팀 회의 문서 - 요구사항 명세서.pdf](https://github.com/user-attachments/files/16707833/2.-.pdf)

[📝 요구사항정의서](https://docs.google.com/spreadsheets/d/1VdXKl6pfghy9OK6zTpShCHeG1uyAGB85Y2ycm1viF5g/edit?gid=566809607#gid=566809607)

<br/>

## 📋 ERD
<img src="./img/MediBooker.jpg" alt="ERD" width="1000" height="700"/>


<br/>

<div align=left>	

## 📌 주요 기능
- 참여 게시판
  - 방탈출 게임을 함께하기위해 원하는 게임, 시간, 인원을 선택하여 사람들은 모집할 수 있습니다.
  - 인원이 가득찬다면 자동을 채팅방을 생성해 참여 인원들에게 초대메시지를 보내, 해당 인원들은 초대메시지를 통해 채팅방에 참여할 수 있습니다.
- 검색 기능
  - 게임을 카테고리별, 금액별, 난이도별로 검색할 수 있습니다.
- 예약
  - 사용자가 예약을 요청하면 점주는 예약 요청에 대한 알림을 받을 수 있습니다.
  - 점주의 예약 승인/거절 여부에 대해서 사용자는 알림을 받을 수 있습니다. 

<br/>

## ✨ 기능 테스트
<details>
<summary>
  <b> 게시판</b>
</summary>
  <div markdown="">
    <ul>
      <li>게시판 글 작성</li>
      <li>게시판 글 수정 및 삭제</li>
      <li>게시판 글 검색(제목, 카테고리, 내용)</li>
      <li>게시판 글 추천/비추천</li>
      <li>뎃글 작성 및 수정</li>
      <li>댓글 추천/비추천</li>
    </ul>
  </div>
</details>

<details>
  <summary>
    <b>Escape With me</b>
  </summary>
  <div markdown="1">
    <ul>
      <li>모집글 작성</li
      <li>모집글 삭제</li>
      <li>모집글 참여</li>
    </ul>
  </div>
</details>

<details>
  <summary>
    <b>예약 및 리뷰 작성</b>
  </summary>
  <div markdown="1">
    <ul>
      <li>예약 요청</li>
      <li>[점주]예약 거절 및 승인</li>
      <li>리뷰 작성 및 조회</li>
      <li>리뷰 수정 및 삭제</li>
    </ul>
  </div>
</details>

<details>
  <summary>
    <b>알림</b>
  </summary>
  <div markdown="1">
    <ul>
      <li>알림 목록 조회</li>
    </ul>
  </div>
</details>

<details>
  <summary>
    <b>실시간 채팅</b>
  </summary>
  <div markdown="1">
    <ul>
      <li>실시간 채팅</li>
    </ul>
  </div>
</details>
