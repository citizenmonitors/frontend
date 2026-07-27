import axios from "axios";
import { backendRoutes } from "./backend";
import { publicBackendJsonAxiosConfig } from "./axiosConfig";
import { AcademyArticleResponse, AcademyListResponse } from "../types/academy";

export async function fetchAcademyArticles(): Promise<AcademyListResponse> {
  const { data } = await axios.get<AcademyListResponse>(
    backendRoutes.academy.list,
    publicBackendJsonAxiosConfig()
  );
  return data;
}

export async function fetchAcademyArticle(slug: string): Promise<AcademyArticleResponse> {
  const { data } = await axios.get<AcademyArticleResponse>(
    backendRoutes.academy.article(slug),
    publicBackendJsonAxiosConfig()
  );
  return data;
}
