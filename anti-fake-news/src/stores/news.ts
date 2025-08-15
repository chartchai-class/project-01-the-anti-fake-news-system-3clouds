// src/stores/news.ts
import { defineStore } from 'pinia'
import apiClient from '../services/NewsService' // Import apiClient เข้ามาใช้งาน

// 1. กำหนด Interfaces สำหรับโครงสร้างข้อมูล (ไม่เปลี่ยนแปลง)
export interface Comment {
  id: number
  user: string
  text: string
  image: string | null
  time: string
  vote: 'real' | 'fake'
}

export interface News {
  id: number
  topic: string
  shortDetail: string
  fullDetail: string
  image: string
  reporter: string
  dateTime: string
  voteSummary: {
    real: number
    fake: number
  }
  comments: Comment[]
  status?: 'fake' | 'not fake' | 'equal'
}

interface NewsState {
  allNews: News[]
}

// 2. สร้าง Pinia Store
export const useNewsStore = defineStore('news', {
  state: (): NewsState => ({
    allNews: [],
  }),
  getters: {
    /**
     * ดึงข้อมูลข่าวสารตาม ID พร้อมคำนวณสถานะ (fake/not fake)
     * @param {number} id - ID ของข่าวสาร
     * @returns {News | undefined} ข้อมูลข่าวสารพร้อมสถานะ หรือ undefined หากไม่พบ
     */
    getNewsById:
      (state) =>
      (id: number): News | undefined => {
        const newsItem = state.allNews.find((news) => news.id === id)
        if (!newsItem) return undefined

        let calculatedStatus: 'fake' | 'not fake' | 'equal'
        if (newsItem.voteSummary.real > newsItem.voteSummary.fake) {
          calculatedStatus = 'not fake'
        } else if (newsItem.voteSummary.real < newsItem.voteSummary.fake) {
          calculatedStatus = 'fake'
        } else {
          calculatedStatus = 'equal'
        }

        return { ...newsItem, status: calculatedStatus }
      },

    /**
     * ดึงรายการข่าวทั้งหมดหรือกรองตามสถานะ พร้อมคำนวณสถานะ (fake/not fake) ให้แต่ละข่าว
     * @param {'all' | 'fake' | 'not fake'} statusFilter - ตัวกรองสถานะ
     * @returns {News[]} รายการข่าวที่ถูกกรองและมีสถานะ
     */
    getNewsWithStatus:
      (state) =>
      (statusFilter: 'all' | 'fake' | 'not fake' | 'equal'): News[] => {
        const allNewsWithStatus = state.allNews.map((news) => {
          let calculatedStatus: 'fake' | 'not fake' | 'equal'
          if (news.voteSummary.real > news.voteSummary.fake) {
            calculatedStatus = 'not fake'
          } else if (news.voteSummary.real < news.voteSummary.fake) {
            calculatedStatus = 'fake'
          } else {
            calculatedStatus = 'equal'
          }

          return { ...news, status: calculatedStatus }
        })

        if (statusFilter === 'all') {
          return allNewsWithStatus
        }
        return allNewsWithStatus.filter((news) => news.status === statusFilter)
      },
  },
  actions: {
    /**
     * ดึงข้อมูลข่าวสารทั้งหมดจาก MockAPI.io
     */
    async fetchNews() {
      try {
        const response = await apiClient.getNews()
        // โค้ดส่วนนี้ถูกต้องแล้ว เพราะ MockAPI.io จะคืนค่าเป็น Array ของข่าวมาโดยตรง
        this.allNews = response.data
      } catch (error) {
        console.error('Error fetching news:', error)
        this.allNews = []
      }
    },

    /**
     * เพิ่มความคิดเห็นและโหวตให้กับข่าวสารที่ระบุ (ข้อมูลนี้จะอยู่แค่ใน Frontend ตามโจทย์)
     * @param {number} newsId - ID ของข่าวสารที่ต้องการเพิ่มความคิดเห็น
     * @param {string} user - ชื่อผู้ใช้งาน
     * @param {string} text - ข้อความความคิดเห็น
     * @param {string | null} image - URL รูปภาพ (ถ้ามี)
     * @param {'real' | 'fake'} vote - การโหวต (real หรือ fake)
     */
    addCommentToNews(
      newsId: number,
      user: string,
      text: string,
      image: string | null,
      vote: 'real' | 'fake',
    ) {
      const newsItem = this.allNews.find((n) => n.id === newsId)
      if (!newsItem) {
        console.error('News item not found!')
        return
      }

      const newCommentId =
        newsItem.comments.length > 0 ? Math.max(...newsItem.comments.map((c) => c.id)) + 1 : 1

      const newComment: Comment = {
        id: newCommentId,
        user,
        text,
        image,
        time: new Date().toISOString(),
        vote,
      }

      newsItem.comments.push(newComment)

      if (vote === 'real') {
        newsItem.voteSummary.real++
      } else {
        newsItem.voteSummary.fake++
      }
    },
  },
})
