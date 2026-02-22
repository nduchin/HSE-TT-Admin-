document.getElementById("openTT").addEventListener("click", openTT);
//document.getElementById("test").addEventListener("click", getTabList);

async function openTT(){
  const url = await getURL();
  const regex = /((?<=portfolio.hse.ru\/[Pp]roject\/)(\d*)(?=$|#))|((?<=portfolio.hse.ru\/.*#)(\d*)(?=_))|((?<=portfolio.hse.ru\/.*#)(\d*)(?=_))/
  const match = url.match(regex)
  const tabs = await getTabList()
  if (match) {
    const projId = match[0]
    const res = await fetch(`https://api.design.hse.ru/v1.2/userprojects/${projId}?includeModuleCourseGroup=true`, {
    method: 'GET',
    Accept: 'application/json'
  })
  console.log(res)
  const obj = await res.json()
  const examUrl = `https://timetracker.hse.ru/examinermarks.aspx?groupId=${obj.moduleCourse.groupId}&moduleId=${obj.moduleCourse.moduleId}&disciplineId=${obj.moduleCourse.disciplineId}`
  
  const examTab = tabs.find((tab) => tab.url == examUrl)
  console.log(examTab)
  if (examTab) {focusTab(examTab)} else {openNewTab(examUrl)}
  }
}

function openNewTab(tabUrl) {
  chrome.tabs.create({url: tabUrl})
}

function focusTab (tab) {
  chrome.tabs.update(tab.id, {active: true})
}

async function getURL() {
  const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
  return tab.url;
}

async function getTabList() {
  const tabs = await chrome.tabs.query({});
  return tabs;
}