const BASE_PATH = "/dashboard"

const getPath = (path: string) => `${BASE_PATH}${path}`

export const PATHS = {
  dashboard: getPath("/"),
  login: "/login",
  register: "/register",
  teachers: {
    root: getPath("/teachers"),
    create: getPath("/teachers/add"),
    edit: (id: string) => getPath(`/teachers/edit/${id}`),
  },
  students: {
    root: getPath("/students"),
    details: (id: string) => getPath(`/students/${id}`),
    create: getPath("/students/add"),
    edit: (id: string) => getPath(`/students/edit/${id}`),
  },
  classes: {
    root: getPath("/classes"),
    create: getPath("/classes/add"),
    edit: (id: string) => getPath(`/classes/edit/${id}`),
  },
  programs: {
    root: getPath("/programs"),
    create: getPath("/programs/add"),
    edit: (id: string) => getPath(`/programs/edit/${id}`),
  },
  accounting: {
    payments: {
      root: getPath("/accounting/payments"),
      create: getPath("/accounting/payments/add"),
      edit: (id: string) => getPath(`/accounting/payments/edit/${id}`),
    },
    expenses: {
      root: getPath("/accounting/expenses"),
      create: getPath("/accounting/expenses/add"),
      edit: (id: string) => getPath(`/accounting/expenses/edit/${id}`),
    },
  },
}
