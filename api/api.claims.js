import httpClient from "./httpClient";

const CLMAPI_END_POINT = "/ClmApi";
const API_END_POINT = "/Api";

// Поиск обращений
const searchClaims = (model) =>
  httpClient.post(API_END_POINT + "/ClmSearch", {
    model,
  });

// Обращение краткое
const getClaim = (id) =>
  httpClient.get(CLMAPI_END_POINT + "/GetClaim", { params: { id } });

// Обращение полное
const getClaimFull = (id) =>
  httpClient.get(CLMAPI_END_POINT + "/GetClaimFull", { params: { id } });

// Обращение с событием
const getClaimAndEvent = (id) =>
  httpClient.get(CLMAPI_END_POINT + "/GetClaimAndEvent", { params: { id } });

// Все обращения одного события
const getClaimsByEvent = ({ eventId, claimId }) =>
  httpClient.get(CLMAPI_END_POINT + "/GetClaimList", {
    params: { eventId, claimId },
  });
// Обращения клиента
const getClaimsByClient = ({ clientId, claimIdFilter }) =>
  httpClient.get(CLMAPI_END_POINT + "/GetClaimListByClient", {
    params: { clientId, claimIdFilter },
  });

// Сохранение обращения
const setClaim = (model, linkedId = null) =>
  httpClient.post(CLMAPI_END_POINT + "/SetClaim", { model, linkedId });
// Сохранение обращения без полиса
const setClaimWithoutOms = (docId, linkedId, phone, question) =>
  httpClient.post(CLMAPI_END_POINT + "/SetClaimWithoutOms", {
    docId,
    linkedId,
    phone,
    question,
  });

// Обновление
const updateClaim = (model) =>
  httpClient.post(CLMAPI_END_POINT + "/UpdClaim", { model });

// Стадии
const getAllowedClaimStages = (claimId, stateId) =>
  httpClient.get(CLMAPI_END_POINT + "/GetAllowedStages", {
    params: { claimId, stateId },
  });

// Установка статуса
const setClaimStatus = (claimId, stateId, stageId, closeDate, openDate) =>
  httpClient.post(CLMAPI_END_POINT + "/SetClaimStatus", {
    claimId,
    stateId,
    stageId,
    closeDate,
    openDate,
  });

// Статистика обращений
const getStatisticsForClaims = () =>
  httpClient.get(CLMAPI_END_POINT + "/GetClmStatistics");
// Наличие стадии
const getIsStageExist = (claimId, stageId) =>
  httpClient.get(CLMAPI_END_POINT + "/ExistsStage", {
    params: { claimId, stageId },
  });

export {
  searchClaims,
  getClaim,
  getClaimFull,
  getClaimsByEvent,
  getClaimsByClient,
  getClaimAndEvent,
  setClaim,
  setClaimWithoutOms,
  updateClaim,
  getAllowedClaimStages,
  setClaimStatus,
  getStatisticsForClaims,
  getIsStageExist,
};
