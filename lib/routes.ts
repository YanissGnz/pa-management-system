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
    root: getPath("/accounting"),
    create: getPath("/accounting/add"),
    edit: (id: string) => getPath(`/accounting/edit/${id}`),
  },
}
