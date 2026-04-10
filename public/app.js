const viewMeta = {
  teacher: {
    kicker: "Teacher Workspace",
    title: "오늘 수업 통합 기록"
  },
  operations: {
    kicker: "Operations Overview",
    title: "운영자 대시보드"
  },
  permissions: {
    kicker: "Access Control",
    title: "사용자 · 권한 관리"
  },
  records: {
    kicker: "Records Center",
    title: "서류 · 기록 관리"
  }
};

const attendanceSeed = [
  { name: "김준서", grade: "2학년", state: "present" },
  { name: "이나은", grade: "3학년", state: "present" },
  { name: "박민준", grade: "4학년", state: "late" },
  { name: "최서윤", grade: "2학년", state: "present" }
];

const stateCycle = {
  present: "late",
  late: "absent",
  absent: "present"
};

const stateLabel = {
  present: "출석",
  late: "지각",
  absent: "결석"
};

const users = [
  {
    id: 1,
    name: "김소연",
    role: "운영자",
    scope: "전체 마을",
    note: "최고 권한",
    updatedAt: "오늘 15:12"
  },
  {
    id: 2,
    name: "이하늘",
    role: "강사",
    scope: "다로리마을 / 목공 메이커 수업",
    note: "현장 입력 담당",
    updatedAt: "오늘 16:24"
  },
  {
    id: 3,
    name: "박지민",
    role: "강사",
    scope: "청도읍 / 생태 관찰 수업",
    note: "교육일지 미제출 1건",
    updatedAt: "오늘 14:03"
  },
  {
    id: 4,
    name: "정유나",
    role: "강사",
    scope: "화양읍 / 마을 탐구 수업",
    note: "첨부 문서 정상",
    updatedAt: "어제 17:52"
  }
];

const records = [
  {
    id: 101,
    title: "목공 메이커 수업",
    teacher: "이하늘",
    village: "다로리마을",
    status: "제출 완료",
    time: "2026.04.10 17:48",
    journal: "새집 프레임 제작을 진행했고 대부분 망치 사용에 빠르게 적응했습니다.",
    attendance: "출석 3명, 지각 1명, 결석 0명",
    files: ["lesson-plan-woodcraft.pdf", "attendance-export-apr10.xlsx"]
  },
  {
    id: 102,
    title: "생태 관찰 수업",
    teacher: "박지민",
    village: "청도읍",
    status: "교육일지 미제출",
    time: "2026.04.10 16:58",
    journal: "요약 미제출",
    attendance: "출석 5명, 지각 0명, 결석 0명",
    files: ["field-guide-spring.pdf"]
  },
  {
    id: 103,
    title: "마을 탐구 수업",
    teacher: "정유나",
    village: "화양읍",
    status: "첨부 문서 검토 대기",
    time: "2026.04.10 16:12",
    journal: "마을 지도 작성 활동과 인터뷰 준비를 진행했습니다.",
    attendance: "출석 4명, 지각 0명, 결석 1명",
    files: ["village-map-notes.docx", "attendance-export-hwayang.xlsx"]
  }
];

const navItems = [...document.querySelectorAll(".nav-item")];
const views = [...document.querySelectorAll(".view")];
const titleNode = document.getElementById("view-title");
const kickerNode = document.getElementById("view-kicker");
const clockNode = document.getElementById("live-clock");
const attendanceList = document.getElementById("attendance-list");
const attendanceSummary = document.getElementById("attendance-summary");
const prepValue = document.getElementById("prep-value");
const prepFill = document.getElementById("prep-fill");
const userList = document.getElementById("user-list");
const userDetail = document.getElementById("user-detail");
const userSearch = document.getElementById("user-search");
const recordTable = document.getElementById("record-table");
const recordDetail = document.getElementById("record-detail");
const toast = document.getElementById("toast");

let selectedUserId = users[0].id;
let selectedRecordId = records[0].id;

function updateClock() {
  const now = new Date();
  const time = now.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
  clockNode.textContent = time;
}

function switchView(viewName) {
  navItems.forEach((item) => {
    item.classList.toggle("active", item.dataset.view === viewName);
  });

  views.forEach((view) => {
    view.classList.toggle("active", view.dataset.viewPanel === viewName);
  });

  kickerNode.textContent = viewMeta[viewName].kicker;
  titleNode.textContent = viewMeta[viewName].title;
}

function renderAttendance() {
  attendanceList.innerHTML = "";

  attendanceSeed.forEach((entry, index) => {
    const row = document.createElement("button");
    row.type = "button";
    row.className = "attendance-row";
    row.dataset.index = String(index);
    row.innerHTML = `
      <div>
        <strong class="attendance-name">${entry.name}</strong>
        <div class="attendance-meta">${entry.grade} · 다로리마을</div>
      </div>
      <div class="attendance-meta">상태를 눌러 변경</div>
      <span class="attendance-state state-${entry.state}">${stateLabel[entry.state]}</span>
    `;

    row.addEventListener("click", () => {
      entry.state = stateCycle[entry.state];
      renderAttendance();
    });

    attendanceList.appendChild(row);
  });

  const presentCount = attendanceSeed.filter((entry) => entry.state === "present").length;
  attendanceSummary.textContent = `${presentCount}명 출석 입력 완료`;

  const completedWeight = attendanceSeed.reduce((sum, entry) => {
    if (entry.state === "present") return sum + 25;
    if (entry.state === "late") return sum + 20;
    return sum + 15;
  }, 0);

  const score = Math.min(100, Math.round((completedWeight + 10) / attendanceSeed.length));
  prepValue.textContent = `${score}%`;
  prepFill.style.width = `${score}%`;
}

function renderUsers(filteredUsers) {
  userList.innerHTML = "";

  if (!filteredUsers.length) {
    userList.innerHTML = `
      <div class="detail-block">
        <p class="detail-label">검색 결과</p>
        <p class="detail-text">일치하는 사용자가 없습니다. 다른 이름이나 역할로 다시 검색해보세요.</p>
      </div>
    `;
    return;
  }

  filteredUsers.forEach((user) => {
    const row = document.createElement("button");
    row.type = "button";
    row.className = `data-row${user.id === selectedUserId ? " active" : ""}`;
    row.innerHTML = `
      <div class="data-main">
        <strong>${user.name}</strong>
        <span>${user.scope}</span>
      </div>
      <div class="data-meta">
        <div class="tagline">${user.role}</div>
        <span>${user.updatedAt}</span>
      </div>
    `;

    row.addEventListener("click", () => {
      selectedUserId = user.id;
      renderUsers(filteredUsers);
      renderUserDetail();
    });

    userList.appendChild(row);
  });
}

function renderUserDetail() {
  const user = users.find((entry) => entry.id === selectedUserId);

  if (!user) {
    userDetail.innerHTML = `
      <div class="detail-block">
        <p class="detail-label">권한 상세</p>
        <p class="detail-text">선택된 사용자가 없습니다.</p>
      </div>
    `;
    return;
  }

  userDetail.innerHTML = `
    <div class="detail-block">
      <p class="detail-label">사용자</p>
      <p class="detail-value"><strong>${user.name}</strong></p>
      <p class="detail-text">${user.note}</p>
    </div>
    <div class="detail-grid">
      <div class="detail-block">
        <p class="detail-label">현재 역할</p>
        <p class="detail-value">${user.role}</p>
      </div>
      <div class="detail-block">
        <p class="detail-label">권한 범위</p>
        <p class="detail-value">${user.scope}</p>
      </div>
    </div>
    <div class="detail-block">
      <p class="detail-label">변경 액션</p>
      <div class="quick-grid">
        <button class="quick-link" type="button">운영자 지정</button>
        <button class="quick-link" type="button">강사 지정</button>
        <button class="quick-link" type="button">범위 수정</button>
      </div>
    </div>
  `;
}

function renderRecords() {
  recordTable.innerHTML = "";

  records.forEach((record) => {
    const row = document.createElement("button");
    row.type = "button";
    row.className = `record-row${record.id === selectedRecordId ? " active" : ""}`;
    row.innerHTML = `
      <div class="record-main">
        <strong>${record.title}</strong>
        <span>${record.teacher} · ${record.village}</span>
      </div>
      <div class="record-meta">
        <div class="tagline">${record.status}</div>
        <span>${record.time}</span>
      </div>
    `;

    row.addEventListener("click", () => {
      selectedRecordId = record.id;
      renderRecords();
      renderRecordDetail();
    });

    recordTable.appendChild(row);
  });
}

function renderRecordDetail() {
  const record = records.find((entry) => entry.id === selectedRecordId);

  if (!record) {
    recordDetail.innerHTML = `
      <div class="detail-block">
        <p class="detail-label">기록 상세</p>
        <p class="detail-text">선택된 기록이 없습니다.</p>
      </div>
    `;
    return;
  }

  const fileItems = record.files
    .map((file) => `<li><span>${file}</span><strong>첨부됨</strong></li>`)
    .join("");

  recordDetail.innerHTML = `
    <div class="detail-block">
      <p class="detail-label">수업 정보</p>
      <p class="detail-value"><strong>${record.title}</strong></p>
      <p class="detail-text">${record.teacher} · ${record.village}</p>
    </div>
    <div class="detail-block">
      <p class="detail-label">출석 기록</p>
      <p class="detail-text">${record.attendance}</p>
    </div>
    <div class="detail-block">
      <p class="detail-label">교육일지</p>
      <p class="detail-text">${record.journal}</p>
    </div>
    <div class="detail-block">
      <p class="detail-label">첨부 문서</p>
      <ul class="summary-list">${fileItems}</ul>
    </div>
  `;
}

function filterUsers() {
  const keyword = userSearch.value.trim();
  const filtered = users.filter((user) => {
    if (!keyword) return true;
    return `${user.name} ${user.role} ${user.scope}`.includes(keyword);
  });

  if (filtered.length && !filtered.some((user) => user.id === selectedUserId)) {
    selectedUserId = filtered[0]?.id ?? users[0].id;
  }

  renderUsers(filtered);
  if (filtered.length) {
    renderUserDetail();
  } else {
    userDetail.innerHTML = `
      <div class="detail-block">
        <p class="detail-label">권한 상세</p>
        <p class="detail-text">검색 결과가 없어서 상세 정보를 표시할 수 없습니다.</p>
      </div>
    `;
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 1800);
}

navItems.forEach((item) => {
  item.addEventListener("click", () => switchView(item.dataset.view));
});

document.querySelectorAll("[data-goto]").forEach((button) => {
  button.addEventListener("click", () => switchView(button.dataset.goto));
});

document.getElementById("submit-session").addEventListener("click", () => {
  showToast("오늘 수업 기록이 제출되었습니다.");
});

userSearch.addEventListener("input", filterUsers);

updateClock();
window.setInterval(updateClock, 1000);

renderAttendance();
renderUsers(users);
renderUserDetail();
renderRecords();
renderRecordDetail();
switchView("teacher");
