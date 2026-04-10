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
  },
  insights: {
    kicker: "Insights",
    title: "통계 · 성과"
  }
};

const accessMap = {
  teacher: ["teacher"],
  operator: ["operations", "permissions", "records", "insights"]
};

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

const roleLabel = {
  teacher: "강사",
  operator: "운영자"
};

const statusMeta = {
  complete: {
    label: "제출 완료",
    className: "status-ok"
  },
  journal_missing: {
    label: "교육일지 미제출",
    className: "status-warn"
  },
  attendance_pending: {
    label: "출석 입력 대기",
    className: "status-alert"
  },
  files_review: {
    label: "첨부 문서 검토 대기",
    className: "status-neutral"
  }
};

const users = [
  {
    id: 1,
    name: "김소연",
    accessRole: "operator",
    scope: "전체 마을",
    note: "최고 권한",
    updatedAt: "오늘 15:12",
    history: ["전체 운영 계정으로 생성됨", "권한 변경 내역 없음"]
  },
  {
    id: 2,
    name: "이하늘",
    accessRole: "teacher",
    scope: "다로리마을 / 목공 메이커 수업",
    note: "현장 입력 담당",
    updatedAt: "오늘 16:24",
    history: ["다로리마을 강사 권한 유지", "현장 입력 계정으로 확인됨"]
  },
  {
    id: 3,
    name: "박지민",
    accessRole: "teacher",
    scope: "청도읍 / 생태 관찰 수업",
    note: "교육일지 미제출 1건",
    updatedAt: "오늘 14:03",
    history: ["청도읍 생태 수업 담당", "교육일지 미제출 알림 확인"]
  },
  {
    id: 4,
    name: "정유나",
    accessRole: "teacher",
    scope: "화양읍 / 마을 탐구 수업",
    note: "첨부 문서 정상",
    updatedAt: "어제 17:52",
    history: ["화양읍 담당 강사 유지", "첨부 문서 정상 제출"]
  }
];

const attendanceEntries = [
  { id: 1, name: "김준서", grade: "2학년", state: "present" },
  { id: 2, name: "이나은", grade: "3학년", state: "present" },
  { id: 3, name: "박민준", grade: "4학년", state: "late" },
  { id: 4, name: "최서윤", grade: "2학년", state: "present" }
];

const teacherForm = {
  date: "2026-04-10",
  village: "다로리마을",
  session: "목공 메이커 수업 / 15:00",
  summary:
    "목공 메이커 수업에서 새집 프레임 조립을 진행했습니다. 초반 설명 후 개별 제작으로 넘어갔고, 대부분 망치 사용에 빠르게 적응했습니다.",
  memo:
    "재료 소진이 빠른 편이라 다음 회차 전 목재 키트 추가 확보가 필요합니다. 공구 정리 시간은 10분 확보가 적절했습니다.",
  attachments: [
    { name: "lesson-plan-woodcraft.pdf", desc: "수업자료 · 1.2MB" },
    { name: "attendance-export-apr10.xlsx", desc: "출석기록 · 324KB" }
  ]
};

const uploadPool = [
  { name: "photo-log-apr10.zip", desc: "활동사진 · 8.4MB" },
  { name: "materials-checklist.docx", desc: "운영서류 · 182KB" },
  { name: "teacher-note-apr10.hwp", desc: "교육일지 보조 · 94KB" },
  { name: "consent-form-scan.pdf", desc: "서류 · 642KB" }
];

const records = [
  {
    id: 101,
    title: "목공 메이커 수업",
    teacherId: 2,
    village: "다로리마을",
    date: "2026-04-10",
    submittedAt: "2026.04.10 17:48",
    status: "complete",
    journal:
      "새집 프레임 제작을 진행했고 대부분 망치 사용에 빠르게 적응했습니다.",
    attendance: "출석 3명, 지각 1명, 결석 0명",
    files: ["lesson-plan-woodcraft.pdf", "attendance-export-apr10.xlsx"]
  },
  {
    id: 102,
    title: "생태 관찰 수업",
    teacherId: 3,
    village: "청도읍",
    date: "2026-04-10",
    submittedAt: "2026.04.10 16:58",
    status: "journal_missing",
    journal: "요약 미제출",
    attendance: "출석 5명, 지각 0명, 결석 0명",
    files: ["field-guide-spring.pdf"]
  },
  {
    id: 103,
    title: "마을 탐구 수업",
    teacherId: 4,
    village: "화양읍",
    date: "2026-04-10",
    submittedAt: "2026.04.10 16:12",
    status: "files_review",
    journal:
      "마을 지도 작성 활동과 인터뷰 준비를 진행했습니다.",
    attendance: "출석 4명, 지각 0명, 결석 1명",
    files: ["village-map-notes.docx", "attendance-export-hwayang.xlsx"]
  },
  {
    id: 104,
    title: "공예 수업",
    teacherId: 2,
    village: "각남면",
    date: "2026-04-10",
    submittedAt: "2026.04.10 15:40",
    status: "attendance_pending",
    journal: "수업 준비 완료, 출석 입력 전",
    attendance: "출석 입력 전",
    files: []
  }
];

const activityLog = [
  { time: "17:48", text: "목공 메이커 수업 제출 완료" },
  { time: "17:31", text: "attendance-export-apr10.xlsx 업로드" },
  { time: "16:58", text: "생태 관찰 수업 교육일지 수정 요청" },
  { time: "16:24", text: "화양읍 강사 권한 범위 변경" }
];

const appState = {
  loginRole: "teacher",
  currentUserId: null,
  activeView: null,
  teacherDirty: false,
  selectedUserId: users[0].id,
  selectedRecordId: records[0].id,
  draftSavedAt: null,
  lastSubmission: {
    title: "생태 관찰 수업 / 2026.04.09",
    copy: "출석 5명, 교육일지 제출 완료, 첨부 문서 1건",
    time: "17:48",
    status: "운영자 확인 전",
    missing: "없음"
  }
};

const entryScreen = document.getElementById("entry-screen");
const workspaceShell = document.getElementById("workspace-shell");
const roleSwitch = document.getElementById("role-switch");
const loginAccount = document.getElementById("login-account");
const loginHint = document.getElementById("login-hint");
const loginButton = document.getElementById("login-button");
const logoutButton = document.getElementById("logout-button");
const currentUserName = document.getElementById("current-user-name");
const currentUserRole = document.getElementById("current-user-role");
const currentUserScope = document.getElementById("current-user-scope");
const currentUserChip = document.getElementById("current-user-chip");
const roleAccessChip = document.getElementById("role-access-chip");
const navItems = [...document.querySelectorAll(".nav-item")];
const views = [...document.querySelectorAll(".view")];
const titleNode = document.getElementById("view-title");
const kickerNode = document.getElementById("view-kicker");
const clockNode = document.getElementById("live-clock");
const teacherAlert = document.getElementById("teacher-alert");
const teacherStatusChip = document.getElementById("teacher-status-chip");
const attendanceList = document.getElementById("attendance-list");
const attendanceSummary = document.getElementById("attendance-summary");
const journalSummary = document.getElementById("journal-summary");
const fileSummary = document.getElementById("file-summary");
const prepValue = document.getElementById("prep-value");
const prepFill = document.getElementById("prep-fill");
const submissionStatusNote = document.getElementById("submission-status-note");
const fileList = document.getElementById("file-list");
const uploadHint = document.getElementById("upload-hint");
const userList = document.getElementById("user-list");
const userDetail = document.getElementById("user-detail");
const userSearch = document.getElementById("user-search");
const roleFilter = document.getElementById("role-filter");
const userFilterNote = document.getElementById("user-filter-note");
const recordTable = document.getElementById("record-table");
const recordDetail = document.getElementById("record-detail");
const recordVillageFilter = document.getElementById("record-village-filter");
const recordTypeFilter = document.getElementById("record-type-filter");
const recordSearch = document.getElementById("record-search");
const recordDateFilter = document.getElementById("record-date-filter");
const recordFilterNote = document.getElementById("record-filter-note");
const toast = document.getElementById("toast");

const teacherInputs = {
  date: document.getElementById("session-date"),
  village: document.getElementById("session-village"),
  session: document.getElementById("session-class"),
  summary: document.getElementById("journal-summary-input"),
  memo: document.getElementById("journal-note-input")
};

const operationsNodes = {
  completed: document.getElementById("ops-completed-count"),
  pending: document.getElementById("ops-pending-count"),
  files: document.getElementById("ops-files-count"),
  review: document.getElementById("ops-review-count"),
  statusRows: document.getElementById("status-rows"),
  activityLog: document.getElementById("activity-log"),
  riskSummary: document.getElementById("risk-summary")
};

const insightNodes = {
  totalRecords: document.getElementById("insight-total-records"),
  completionRate: document.getElementById("insight-completion-rate"),
  journalGap: document.getElementById("insight-journal-gap"),
  fileTotal: document.getElementById("insight-file-total"),
  teacherPerformance: document.getElementById("teacher-performance"),
  sessionPerformance: document.getElementById("session-performance"),
  villagePerformance: document.getElementById("village-performance"),
  completionPerformance: document.getElementById("completion-performance"),
  period: document.getElementById("insight-period")
};

const lastSubmissionNodes = {
  title: document.getElementById("last-submission-title"),
  copy: document.getElementById("last-submission-copy"),
  time: document.getElementById("last-submission-time"),
  status: document.getElementById("last-submission-status"),
  missing: document.getElementById("last-submission-missing")
};

function getCurrentUser() {
  return users.find((user) => user.id === appState.currentUserId) || null;
}

function isViewAllowed(viewName) {
  const currentUser = getCurrentUser();
  if (!currentUser) return false;
  return accessMap[currentUser.accessRole].includes(viewName);
}

function getUserById(userId) {
  return users.find((user) => user.id === userId) || null;
}

function getRoleText(accessRole) {
  return roleLabel[accessRole] || accessRole;
}

function getCurrentTimeLabel() {
  return new Date().toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
}

function getNowTimestamp() {
  return `오늘 ${getCurrentTimeLabel()}`;
}

function getStatusMeta(status) {
  return statusMeta[status] || statusMeta.complete;
}

function formatRecordTeacher(record) {
  return getUserById(record.teacherId)?.name || "알 수 없음";
}

function countAttendanceState(targetState) {
  return attendanceEntries.filter((entry) => entry.state === targetState).length;
}

function buildAttendanceSummary() {
  return `출석 ${countAttendanceState("present")}명, 지각 ${countAttendanceState("late")}명, 결석 ${countAttendanceState("absent")}명`;
}

function getFilteredLoginUsers() {
  return users.filter((user) => user.accessRole === appState.loginRole);
}

function renderLoginAccounts() {
  const filteredUsers = getFilteredLoginUsers();
  loginAccount.innerHTML = filteredUsers
    .map(
      (user) =>
        `<option value="${user.id}">${user.name} ${getRoleText(user.accessRole)} · ${user.scope}</option>`
    )
    .join("");

  loginHint.textContent = filteredUsers.length
    ? `${getRoleText(appState.loginRole)} 계정 ${filteredUsers.length}개가 준비되어 있습니다. 현재는 샘플 계정 선택만으로 진입합니다.`
    : "선택한 역할에 사용할 수 있는 계정이 없습니다.";
}

function renderAuthState() {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    document.body.classList.add("mode-entry");
    document.body.classList.remove("mode-workspace");
    document.body.classList.remove("in-workspace");
    entryScreen.hidden = false;
    workspaceShell.hidden = true;
    return;
  }

  document.body.classList.remove("mode-entry");
  document.body.classList.add("mode-workspace");
  document.body.classList.add("in-workspace");
  entryScreen.hidden = true;
  workspaceShell.hidden = false;
  currentUserName.textContent = currentUser.name;
  currentUserRole.textContent = `${getRoleText(currentUser.accessRole)} 계정으로 접속 중`;
  currentUserScope.textContent = currentUser.scope;
  currentUserChip.textContent = currentUser.name;
  roleAccessChip.textContent = getRoleText(currentUser.accessRole);
}

function renderNav() {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  navItems.forEach((item) => {
    const allowedRoles = (item.dataset.access || "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);
    const visible = allowedRoles.includes(currentUser.accessRole);
    item.hidden = !visible;
    item.classList.toggle("active", item.dataset.view === appState.activeView && visible);
  });
}

function updateClock() {
  clockNode.textContent = getCurrentTimeLabel();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

function switchView(viewName, options = {}) {
  const { force = false } = options;

  if (!isViewAllowed(viewName)) {
    showToast("현재 계정으로는 이 메뉴에 접근할 수 없습니다.");
    return;
  }

  if (
    !force &&
    appState.teacherDirty &&
    appState.activeView === "teacher" &&
    viewName !== "teacher"
  ) {
    const shouldLeave = window.confirm(
      "아직 제출하지 않은 변경 사항이 있습니다. 이동하면 현재 입력 흐름이 끊길 수 있어요. 계속할까요?"
    );
    if (!shouldLeave) return;
  }

  appState.activeView = viewName;
  views.forEach((view) => {
    view.classList.toggle("active", view.dataset.viewPanel === viewName);
  });
  titleNode.textContent = viewMeta[viewName].title;
  kickerNode.textContent = viewMeta[viewName].kicker;
  renderNav();
}

function setTeacherDirty(nextDirty = true) {
  appState.teacherDirty = nextDirty;
}

function validateTeacherForm() {
  const errors = [];

  if (!teacherForm.date) errors.push("날짜를 선택해주세요.");
  if (!teacherForm.village) errors.push("마을을 선택해주세요.");
  if (!teacherForm.session) errors.push("수업을 선택해주세요.");
  if (!teacherForm.summary.trim()) errors.push("교육일지 요약은 필수 입력입니다.");
  if (teacherForm.attachments.length === 0) {
    errors.push("최소 1개의 수업자료 또는 운영 서류를 첨부해주세요.");
  }

  return errors;
}

function renderTeacherAlert(errors = []) {
  if (!errors.length) {
    teacherAlert.hidden = true;
    teacherAlert.innerHTML = "";
    return;
  }

  teacherAlert.hidden = false;
  teacherAlert.innerHTML = `
    <strong>제출 전에 확인해주세요.</strong>
    ${errors.map((error) => `<div>${error}</div>`).join("")}
  `;
}

function renderAttendance() {
  attendanceList.innerHTML = "";

  attendanceEntries.forEach((entry, index) => {
    const row = document.createElement("button");
    row.type = "button";
    row.className = "attendance-row";
    row.dataset.index = String(index);
    row.innerHTML = `
      <div>
        <strong class="attendance-name">${entry.name}</strong>
        <div class="attendance-meta">${entry.grade} · ${teacherForm.village}</div>
      </div>
      <div class="attendance-meta">상태를 눌러 변경</div>
      <span class="attendance-state state-${entry.state}">${stateLabel[entry.state]}</span>
    `;

    row.addEventListener("click", () => {
      entry.state = stateCycle[entry.state];
      setTeacherDirty(true);
      renderAttendance();
      renderTeacherSummary();
    });

    attendanceList.appendChild(row);
  });
}

function renderFileList() {
  if (!teacherForm.attachments.length) {
    fileList.innerHTML = `
      <li class="empty-state">아직 첨부한 파일이 없습니다. 최소 1개 파일을 준비해 제출 흐름을 완성해주세요.</li>
    `;
    uploadHint.textContent = "수업자료와 운영 서류를 순서대로 추가할 수 있습니다.";
    return;
  }

  fileList.innerHTML = teacherForm.attachments
    .map(
      (file, index) => `
        <li>
          <div>
            <span>${file.name}</span>
            <small>${file.desc}</small>
          </div>
          <button type="button" data-remove-file="${index}">제거</button>
        </li>
      `
    )
    .join("");

  uploadHint.textContent = `${teacherForm.attachments.length}개 파일이 제출 대기 상태입니다.`;
}

function renderTeacherSummary() {
  const errors = validateTeacherForm();
  const presentCount = countAttendanceState("present");
  const attendanceDone = attendanceEntries.length;
  const journalDone = teacherForm.summary.trim().length > 0;
  const filesDone = teacherForm.attachments.length > 0;
  const completedChunks = [
    teacherForm.date && teacherForm.village && teacherForm.session,
    attendanceDone > 0,
    journalDone,
    filesDone
  ].filter(Boolean).length;
  const score = Math.round((completedChunks / 4) * 100);

  attendanceSummary.textContent = `${presentCount}/${attendanceEntries.length}명 출석 입력 완료`;
  journalSummary.textContent = journalDone ? "필수 항목 작성 완료" : "수업 요약 입력 필요";
  fileSummary.textContent = filesDone
    ? `${teacherForm.attachments.length}개 업로드 준비`
    : "첨부 문서 필요";
  prepValue.textContent = `${score}%`;
  prepFill.style.width = `${score}%`;

  if (errors.length) {
    teacherStatusChip.textContent = "제출 전 확인 필요";
    submissionStatusNote.textContent = "필수값을 모두 채우면 제출 가능 상태로 전환됩니다.";
  } else if (appState.teacherDirty) {
    teacherStatusChip.textContent = "제출 가능";
    submissionStatusNote.textContent = "현재 입력값 기준으로 제출 가능한 상태입니다.";
  } else if (appState.draftSavedAt) {
    teacherStatusChip.textContent = `임시 저장 ${appState.draftSavedAt}`;
    submissionStatusNote.textContent = "최근 저장본이 반영되어 있습니다. 추가 수정 후 다시 제출할 수 있습니다.";
  } else {
    teacherStatusChip.textContent = "작성 중";
    submissionStatusNote.textContent = "필수값을 모두 채우면 제출 가능 상태로 전환됩니다.";
  }
}

function updateLastSubmission(record) {
  const missing = [];
  if (record.status === "attendance_pending") missing.push("출석");
  if (record.status === "journal_missing") missing.push("교육일지");
  if (record.status === "files_review") missing.push("운영자 문서 검토");

  appState.lastSubmission = {
    title: `${record.title} / ${record.date.replaceAll("-", ".")}`,
    copy: `${record.attendance}, 첨부 문서 ${record.files.length}건`,
    time: record.submittedAt.split(" ").pop(),
    status: getStatusMeta(record.status).label,
    missing: missing.length ? missing.join(", ") : "없음"
  };

  lastSubmissionNodes.title.textContent = appState.lastSubmission.title;
  lastSubmissionNodes.copy.textContent = appState.lastSubmission.copy;
  lastSubmissionNodes.time.textContent = appState.lastSubmission.time;
  lastSubmissionNodes.status.textContent = appState.lastSubmission.status;
  lastSubmissionNodes.missing.textContent = appState.lastSubmission.missing;
}

function upsertRecord(nextRecord) {
  const existingIndex = records.findIndex(
    (record) =>
      record.teacherId === nextRecord.teacherId &&
      record.title === nextRecord.title &&
      record.date === nextRecord.date
  );

  if (existingIndex >= 0) {
    records[existingIndex] = nextRecord;
  } else {
    records.unshift(nextRecord);
  }
}

function handleSaveDraft() {
  if (getCurrentUser()?.accessRole !== "teacher") {
    showToast("운영자 계정에서는 강사 입력 화면을 미리보기만 할 수 있습니다.");
    return;
  }

  appState.draftSavedAt = getCurrentTimeLabel();
  setTeacherDirty(false);
  renderTeacherAlert([]);
  renderTeacherSummary();
  showToast(`임시 저장되었습니다. (${appState.draftSavedAt})`);
}

function handleSubmitSession() {
  const currentUser = getCurrentUser();
  if (!currentUser) return;
  if (currentUser.accessRole !== "teacher") {
    showToast("운영자 계정에서는 제출을 실행할 수 없습니다. 강사 계정으로 확인해주세요.");
    return;
  }

  const errors = validateTeacherForm();
  renderTeacherAlert(errors);

  if (errors.length) {
    showToast("필수 입력을 확인한 뒤 다시 제출해주세요.");
    return;
  }

  const sessionTitle = teacherForm.session.split(" / ")[0];
  const nextRecord = {
    id: appState.selectedRecordId + Date.now(),
    title: sessionTitle,
    teacherId: currentUser.id,
    village: teacherForm.village,
    date: teacherForm.date,
    submittedAt: `${teacherForm.date.replaceAll("-", ".")} ${getCurrentTimeLabel()}`,
    status: "complete",
    journal: teacherForm.summary.trim(),
    attendance: buildAttendanceSummary(),
    files: teacherForm.attachments.map((file) => file.name)
  };

  upsertRecord(nextRecord);
  appState.selectedRecordId = nextRecord.id;
  appState.draftSavedAt = null;
  setTeacherDirty(false);
  updateLastSubmission(nextRecord);

  const activityText = `${sessionTitle} 제출 완료`;
  activityLog.unshift({ time: getCurrentTimeLabel(), text: activityText });
  activityLog.splice(8);

  currentUser.updatedAt = getNowTimestamp();
  currentUser.note = "최근 제출 완료";
  currentUser.history.unshift(`${activityText} · ${teacherForm.date}`);
  currentUser.history = currentUser.history.slice(0, 4);

  renderTeacherAlert([]);
  renderTeacherSummary();
  renderOperations();
  renderRecords();
  renderRecordDetail();
  renderUsers();
  renderUserDetail();
  renderInsights();
  showToast("오늘 수업 기록이 제출되었습니다.");
}

function handleAttachmentAdd() {
  const nextFile = uploadPool.find(
    (candidate) => !teacherForm.attachments.some((file) => file.name === candidate.name)
  );

  if (!nextFile) {
    showToast("추가할 샘플 파일이 더 없습니다.");
    return;
  }

  teacherForm.attachments.push(nextFile);
  setTeacherDirty(true);
  renderFileList();
  renderTeacherSummary();
  showToast(`${nextFile.name} 파일이 첨부 목록에 추가되었습니다.`);
}

function handleAttachmentRemove(index) {
  teacherForm.attachments.splice(index, 1);
  setTeacherDirty(true);
  renderFileList();
  renderTeacherSummary();
}

function renderOperations() {
  const completedCount = records.filter((record) => record.status === "complete").length;
  const pendingCount = records.filter((record) =>
    ["journal_missing", "attendance_pending"].includes(record.status)
  ).length;
  const fileCount = records.reduce((sum, record) => sum + record.files.length, 0);
  const reviewCount = records.filter((record) => record.status !== "complete").length;

  operationsNodes.completed.textContent = String(completedCount);
  operationsNodes.pending.textContent = String(pendingCount);
  operationsNodes.files.textContent = String(fileCount);
  operationsNodes.review.textContent = String(reviewCount);

  operationsNodes.statusRows.innerHTML = records
    .slice(0, 4)
    .map((record) => {
      const meta = getStatusMeta(record.status);
      return `
        <div class="status-row">
          <span>${record.village} / ${record.title}</span>
          <strong class="${meta.className}">${meta.label}</strong>
        </div>
      `;
    })
    .join("");

  operationsNodes.activityLog.innerHTML = activityLog
    .slice(0, 5)
    .map((log) => `<li><span>${log.time}</span><strong>${log.text}</strong></li>`)
    .join("");

  const journalMissing = records.filter((record) => record.status === "journal_missing").length;
  const fileReview = records.filter((record) => record.status === "files_review").length;
  const attendancePending = records.filter((record) => record.status === "attendance_pending").length;

  operationsNodes.riskSummary.innerHTML = `
    <li><span>교육일지 미제출</span><strong>${journalMissing}건</strong></li>
    <li><span>첨부 문서 검토 대기</span><strong>${fileReview}건</strong></li>
    <li><span>출석 입력 대기</span><strong>${attendancePending}건</strong></li>
  `;
}

function getFilteredUsers() {
  const keyword = userSearch.value.trim();
  const selectedRole = roleFilter.value;

  return users.filter((user) => {
    const matchesKeyword = !keyword
      ? true
      : `${user.name} ${getRoleText(user.accessRole)} ${user.scope}`.includes(keyword);
    const matchesRole = selectedRole === "all" ? true : user.accessRole === selectedRole;
    return matchesKeyword && matchesRole;
  });
}

function renderUsers() {
  const filteredUsers = getFilteredUsers();

  userFilterNote.textContent =
    roleFilter.value === "all"
      ? `검색 결과 ${filteredUsers.length}명`
      : `${getRoleText(roleFilter.value)} 검색 결과 ${filteredUsers.length}명`;

  if (!filteredUsers.length) {
    appState.selectedUserId = null;
    userList.innerHTML = `
      <div class="empty-state">
        선택한 조건에 맞는 사용자가 없습니다. 다른 이름이나 역할로 다시 검색해보세요.
      </div>
    `;
    return;
  }

  if (!filteredUsers.some((user) => user.id === appState.selectedUserId)) {
    appState.selectedUserId = filteredUsers[0].id;
  }

  userList.innerHTML = filteredUsers
    .map((user) => {
      const activeClass = user.id === appState.selectedUserId ? " active" : "";
      return `
        <button class="data-row${activeClass}" type="button" data-user-id="${user.id}">
          <div class="data-main">
            <strong>${user.name}</strong>
            <span>${user.scope}</span>
          </div>
          <div class="data-meta">
            <div class="tagline">${getRoleText(user.accessRole)}</div>
            <span>${user.updatedAt}</span>
          </div>
        </button>
      `;
    })
    .join("");
}

function renderUserDetail() {
  const user = getUserById(appState.selectedUserId);

  if (!user) {
    userDetail.innerHTML = `
      <div class="empty-state">선택된 사용자가 없습니다.</div>
    `;
    return;
  }

  const actionLabel = user.accessRole === "operator" ? "강사 지정" : "운영자 지정";
  const actionTarget = user.accessRole === "operator" ? "teacher" : "operator";

  userDetail.innerHTML = `
    <div class="detail-block">
      <p class="detail-label">사용자</p>
      <p class="detail-value"><strong>${user.name}</strong></p>
      <p class="detail-text">${user.note}</p>
    </div>
    <div class="detail-grid">
      <div class="detail-block">
        <p class="detail-label">현재 역할</p>
        <p class="detail-value">${getRoleText(user.accessRole)}</p>
      </div>
      <div class="detail-block">
        <p class="detail-label">권한 범위</p>
        <p class="detail-value">${user.scope}</p>
      </div>
    </div>
    <div class="detail-block">
      <p class="detail-label">변경 액션</p>
      <div class="quick-grid">
        <button class="quick-link" type="button" data-user-action="toggle-role" data-target-role="${actionTarget}">${actionLabel}</button>
        <button class="quick-link" type="button" data-user-action="expand-scope">범위 확장</button>
        <button class="quick-link" type="button" data-user-action="normalize-scope">기본 범위로 복원</button>
      </div>
    </div>
    <div class="detail-block">
      <p class="detail-label">변경 이력</p>
      <div class="detail-history">
        ${user.history
          .map((entry) => `<div class="detail-history-item">${entry}</div>`)
          .join("")}
      </div>
    </div>
  `;
}

function updateUserState(action) {
  const user = getUserById(appState.selectedUserId);
  const currentUser = getCurrentUser();
  if (!user) return;

  if (
    action === "toggle-role" &&
    currentUser &&
    currentUser.id === user.id &&
    user.accessRole === "operator"
  ) {
    showToast("최고 권한 계정은 스스로 강사로 변경할 수 없습니다.");
    return;
  }

  if (action === "toggle-role") {
    user.accessRole = user.accessRole === "operator" ? "teacher" : "operator";
    user.note = `${getRoleText(user.accessRole)} 권한으로 변경`;
    user.scope =
      user.accessRole === "operator" ? "전체 마을" : user.scope.replace("전체 마을", "다로리마을 / 목공 메이커 수업");
    user.history.unshift(`${getRoleText(user.accessRole)} 권한으로 변경됨`);
  }

  if (action === "expand-scope") {
    user.scope =
      user.accessRole === "operator"
        ? "전체 마을 + 권한 검토"
        : `${user.scope.split(" / ")[0]} / 복수 수업 운영`;
    user.note = "담당 범위 확장 반영";
    user.history.unshift("담당 범위를 확장해 복수 세션을 볼 수 있게 조정");
  }

  if (action === "normalize-scope") {
    user.scope =
      user.accessRole === "operator"
        ? "전체 마을"
        : user.id === 2
          ? "다로리마을 / 목공 메이커 수업"
          : user.id === 3
            ? "청도읍 / 생태 관찰 수업"
            : "화양읍 / 마을 탐구 수업";
    user.note = "기본 권한 범위 복원";
    user.history.unshift("권한 범위를 기본 설정으로 복원");
  }

  user.updatedAt = getNowTimestamp();
  user.history = user.history.slice(0, 4);

  renderAuthState();
  renderNav();
  renderLoginAccounts();
  renderUsers();
  renderUserDetail();
  showToast(`${user.name} 계정 정보가 반영되었습니다.`);
}

function getFilteredRecords() {
  const village = recordVillageFilter.value;
  const type = recordTypeFilter.value;
  const keyword = recordSearch.value.trim();
  const date = recordDateFilter.value;

  return records.filter((record) => {
    const matchesVillage = village === "all" ? true : record.village === village;
    const matchesKeyword = !keyword
      ? true
      : `${record.title} ${formatRecordTeacher(record)} ${record.village}`.includes(keyword);
    const matchesDate = !date ? true : record.date === date;

    let matchesType = true;
    if (type === "journal") matchesType = record.journal && record.journal !== "요약 미제출";
    if (type === "attendance") matchesType = record.attendance !== "출석 입력 전";
    if (type === "files") matchesType = record.files.length > 0;

    return matchesVillage && matchesKeyword && matchesDate && matchesType;
  });
}

function renderRecords() {
  const filteredRecords = getFilteredRecords();
  recordFilterNote.textContent = `검색 결과 ${filteredRecords.length}건`;

  if (!filteredRecords.length) {
    recordTable.innerHTML = `
      <div class="empty-state">
        조건에 맞는 기록이 없습니다. 필터를 초기화하거나 날짜 범위를 바꿔보세요.
      </div>
    `;
    appState.selectedRecordId = null;
    return;
  }

  if (!filteredRecords.some((record) => record.id === appState.selectedRecordId)) {
    appState.selectedRecordId = filteredRecords[0].id;
  }

  recordTable.innerHTML = filteredRecords
    .map((record) => {
      const activeClass = record.id === appState.selectedRecordId ? " active" : "";
      const meta = getStatusMeta(record.status);
      return `
        <button class="record-row${activeClass}" type="button" data-record-id="${record.id}">
          <div class="record-main">
            <strong>${record.title}</strong>
            <span>${formatRecordTeacher(record)} · ${record.village}</span>
          </div>
          <div class="record-meta">
            <div class="tagline">${meta.label}</div>
            <span>${record.submittedAt}</span>
          </div>
        </button>
      `;
    })
    .join("");
}

function renderRecordDetail() {
  const record = records.find((entry) => entry.id === appState.selectedRecordId);

  if (!record) {
    recordDetail.innerHTML = `
      <div class="empty-state">선택된 기록이 없습니다.</div>
    `;
    return;
  }

  const meta = getStatusMeta(record.status);
  const fileItems = record.files.length
    ? record.files.map((file) => `<li><span>${file}</span><strong>첨부됨</strong></li>`).join("")
    : `<li><span>첨부 문서 없음</span><strong>빈 상태</strong></li>`;

  recordDetail.innerHTML = `
    <div class="detail-block">
      <p class="detail-label">수업 정보</p>
      <p class="detail-value"><strong>${record.title}</strong></p>
      <p class="detail-text">${formatRecordTeacher(record)} · ${record.village}</p>
    </div>
    <div class="detail-grid">
      <div class="detail-block">
        <p class="detail-label">제출 일시</p>
        <p class="detail-value">${record.submittedAt}</p>
      </div>
      <div class="detail-block">
        <p class="detail-label">상태</p>
        <p class="detail-value">${meta.label}</p>
      </div>
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

function getPeriodFilteredRecords() {
  const period = insightNodes.period.value;
  if (period === "all") return [...records];
  return [...records].slice(0, Number(period));
}

function aggregateBy(recordsInScope, keyFn) {
  const map = new Map();

  recordsInScope.forEach((record) => {
    const key = keyFn(record);
    const current = map.get(key) || {
      total: 0,
      complete: 0,
      files: 0
    };
    current.total += 1;
    current.files += record.files.length;
    if (record.status === "complete") current.complete += 1;
    map.set(key, current);
  });

  return [...map.entries()].sort((a, b) => b[1].total - a[1].total);
}

function renderRankList(node, items, formatter) {
  if (!items.length) {
    node.innerHTML = `<div class="empty-state">집계할 데이터가 없습니다.</div>`;
    return;
  }

  node.innerHTML = items
    .map(([label, value]) => formatter(label, value))
    .join("");
}

function renderInsights() {
  const scopedRecords = getPeriodFilteredRecords();
  const totalRecords = scopedRecords.length;
  const completeCount = scopedRecords.filter((record) => record.status === "complete").length;
  const journalGap = scopedRecords.filter((record) => record.status === "journal_missing").length;
  const fileTotal = scopedRecords.reduce((sum, record) => sum + record.files.length, 0);
  const completionRate = totalRecords ? Math.round((completeCount / totalRecords) * 100) : 0;

  insightNodes.totalRecords.textContent = String(totalRecords);
  insightNodes.completionRate.textContent = `${completionRate}%`;
  insightNodes.journalGap.textContent = String(journalGap);
  insightNodes.fileTotal.textContent = String(fileTotal);

  const teacherAgg = aggregateBy(scopedRecords, (record) => formatRecordTeacher(record));
  const sessionAgg = aggregateBy(scopedRecords, (record) => record.title);
  const villageAgg = aggregateBy(scopedRecords, (record) => record.village);

  renderRankList(insightNodes.teacherPerformance, teacherAgg, (label, value) => `
    <div class="rank-row">
      <div class="rank-main">
        <strong>${label}</strong>
        <span>세션 ${value.total}건 · 완료 ${value.complete}건</span>
      </div>
      <div class="rank-meta">
        <strong>${value.files} files</strong>
      </div>
    </div>
  `);

  renderRankList(insightNodes.sessionPerformance, sessionAgg, (label, value) => `
    <div class="rank-row">
      <div class="rank-main">
        <strong>${label}</strong>
        <span>세션 ${value.total}건 · 완료 ${value.complete}건</span>
      </div>
      <div class="rank-meta">
        <strong>${Math.round((value.complete / value.total) * 100)}%</strong>
      </div>
    </div>
  `);

  renderRankList(insightNodes.villagePerformance, villageAgg, (label, value) => `
    <div class="rank-row">
      <div class="rank-main">
        <strong>${label}</strong>
        <span>세션 ${value.total}건 · 첨부 ${value.files}건</span>
      </div>
      <div class="rank-meta">
        <strong>${Math.round((value.complete / value.total) * 100)}%</strong>
      </div>
    </div>
  `);

  insightNodes.completionPerformance.innerHTML = `
    <li><span>완료된 제출</span><strong>${completeCount}건</strong></li>
    <li><span>교육일지 누락</span><strong>${journalGap}건</strong></li>
    <li><span>출석 입력 대기</span><strong>${scopedRecords.filter((record) => record.status === "attendance_pending").length}건</strong></li>
    <li><span>문서 검토 대기</span><strong>${scopedRecords.filter((record) => record.status === "files_review").length}건</strong></li>
  `;
}

function handleLogin() {
  const selectedId = Number(loginAccount.value);
  if (!selectedId) {
    showToast("먼저 접속할 계정을 선택해주세요.");
    return;
  }

  appState.currentUserId = selectedId;
  appState.selectedUserId = selectedId;
  renderAuthState();
  renderNav();

  const defaultView = appState.loginRole === "teacher" ? "teacher" : "operations";
  switchView(defaultView, { force: true });
  window.scrollTo(0, 0);
  showToast(`${getUserById(selectedId)?.name} 계정으로 진입했습니다.`);
}

function handleLogout() {
  if (appState.teacherDirty) {
    const shouldLeave = window.confirm(
      "저장되지 않은 강사 입력 내용이 있습니다. 메인 홈으로 돌아갈까요?"
    );
    if (!shouldLeave) return;
  }

  appState.currentUserId = null;
  appState.activeView = null;
  setTeacherDirty(false);
  renderAuthState();
  navItems.forEach((item) => item.classList.remove("active"));
  window.scrollTo(0, 0);
  showToast("메인 홈으로 돌아왔습니다.");
}

function syncTeacherFormFromInputs() {
  teacherForm.date = teacherInputs.date.value;
  teacherForm.village = teacherInputs.village.value;
  teacherForm.session = teacherInputs.session.value;
  teacherForm.summary = teacherInputs.summary.value;
  teacherForm.memo = teacherInputs.memo.value;
}

function bindTeacherInputs() {
  Object.values(teacherInputs).forEach((input) => {
    input.addEventListener("input", () => {
      syncTeacherFormFromInputs();
      setTeacherDirty(true);
      renderTeacherSummary();
      renderAttendance();
    });
  });
}

function bindEvents() {
  roleSwitch.addEventListener("click", (event) => {
    const button = event.target.closest("[data-login-role]");
    if (!button) return;
    appState.loginRole = button.dataset.loginRole;
    roleSwitch.querySelectorAll("[data-login-role]").forEach((chip) => {
      chip.classList.toggle("active", chip.dataset.loginRole === appState.loginRole);
    });
    renderLoginAccounts();
  });

  loginButton.addEventListener("click", handleLogin);
  logoutButton.addEventListener("click", handleLogout);

  navItems.forEach((item) => {
    item.addEventListener("click", () => switchView(item.dataset.view));
  });

  document.querySelectorAll("[data-goto]").forEach((button) => {
    button.addEventListener("click", () => switchView(button.dataset.goto));
  });

  document.getElementById("save-draft").addEventListener("click", handleSaveDraft);
  document.getElementById("submit-session").addEventListener("click", handleSubmitSession);
  document.getElementById("add-attachment").addEventListener("click", handleAttachmentAdd);

  fileList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-file]");
    if (!button) return;
    handleAttachmentRemove(Number(button.dataset.removeFile));
  });

  userSearch.addEventListener("input", () => {
    renderUsers();
    renderUserDetail();
  });

  roleFilter.addEventListener("change", () => {
    renderUsers();
    renderUserDetail();
  });

  userList.addEventListener("click", (event) => {
    const row = event.target.closest("[data-user-id]");
    if (!row) return;
    appState.selectedUserId = Number(row.dataset.userId);
    renderUsers();
    renderUserDetail();
  });

  userDetail.addEventListener("click", (event) => {
    const button = event.target.closest("[data-user-action]");
    if (!button) return;
    updateUserState(button.dataset.userAction);
  });

  [recordVillageFilter, recordTypeFilter, recordSearch, recordDateFilter].forEach((control) => {
    control.addEventListener("input", () => {
      renderRecords();
      renderRecordDetail();
    });
    control.addEventListener("change", () => {
      renderRecords();
      renderRecordDetail();
    });
  });

  recordTable.addEventListener("click", (event) => {
    const row = event.target.closest("[data-record-id]");
    if (!row) return;
    appState.selectedRecordId = Number(row.dataset.recordId);
    renderRecords();
    renderRecordDetail();
  });

  insightNodes.period.addEventListener("change", renderInsights);

  bindTeacherInputs();

  window.addEventListener("beforeunload", (event) => {
    if (!appState.teacherDirty) return;
    event.preventDefault();
    event.returnValue = "";
  });
}

function initialize() {
  renderLoginAccounts();
  renderAuthState();
  renderAttendance();
  renderFileList();
  renderTeacherSummary();
  updateLastSubmission({
    title: "생태 관찰 수업",
    date: "2026-04-09",
    submittedAt: "2026.04.09 17:48",
    status: "complete",
    attendance: "출석 5명, 지각 0명, 결석 0명",
    files: ["field-guide-spring.pdf"]
  });
  renderUsers();
  renderUserDetail();
  renderRecords();
  renderRecordDetail();
  renderOperations();
  renderInsights();
  updateClock();
  window.setInterval(updateClock, 1000);
  bindEvents();
}

initialize();
