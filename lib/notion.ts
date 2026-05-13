import { Client } from "@notionhq/client"

// Notion API 클라이언트 싱글턴
// 환경변수는 서버 컴포넌트 또는 Route Handler에서만 접근 가능
let notionClient: Client | null = null

export function getNotionClient(): Client {
  if (!notionClient) {
    const token = process.env.NOTION_TOKEN
    if (!token) {
      throw new Error("NOTION_TOKEN 환경변수가 설정되지 않았습니다.")
    }
    notionClient = new Client({ auth: token })
  }
  return notionClient
}

// 기술 포트폴리오 메인 페이지 ID 조회
export function getNotionMainPageId(): string {
  const pageId = process.env.NOTION_MAIN_PAGE_ID
  if (!pageId) {
    throw new Error("NOTION_MAIN_PAGE_ID 환경변수가 설정되지 않았습니다.")
  }
  return pageId
}
