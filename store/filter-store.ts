'use client'

import { create } from "zustand"
import type { FilterState, TechCategory, Difficulty } from "@/types"

interface FilterActions {
  // 카테고리 필터 설정 (null이면 전체)
  setCategory: (category: TechCategory | null) => void
  // 태그 토글 (이미 선택된 태그면 제거, 아니면 추가)
  toggleTag: (tag: string) => void
  // 모든 태그 초기화
  clearTags: () => void
  // 난이도 필터 설정
  setDifficulty: (difficulty: Difficulty | null) => void
  // 검색 키워드 설정
  setSearchKeyword: (keyword: string) => void
  // 모든 필터 초기화
  resetFilters: () => void
}

const initialState: FilterState = {
  category: null,
  tags: [],
  difficulty: null,
  searchKeyword: "",
}

export const useFilterStore = create<FilterState & FilterActions>((set) => ({
  ...initialState,

  setCategory: (category) => set({ category }),

  toggleTag: (tag) =>
    set((state) => ({
      tags: state.tags.includes(tag)
        ? state.tags.filter((t) => t !== tag)
        : [...state.tags, tag],
    })),

  clearTags: () => set({ tags: [] }),

  setDifficulty: (difficulty) => set({ difficulty }),

  setSearchKeyword: (searchKeyword) => set({ searchKeyword }),

  resetFilters: () => set(initialState),
}))
