import { apiConnector } from "../apiConnector"
import { homeworkEndPoints } from '../apis';
const { UPDATE_HOMEWORK_STATUS } = homeworkEndPoints


export async function updateHomeworkStatus(token, payload) {
  try {
    const response = await apiConnector("POST", UPDATE_HOMEWORK_STATUS, payload, {
      Authorization: `Bearer ${token}`,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating homework status API:", error);
    throw error;
  }
}
