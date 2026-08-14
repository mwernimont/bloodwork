import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AddProject from "@/views/AddProject.vue";
import EditProject from "@/views/EditProject.vue";
import Project from "@/views/Project.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/add-project",
      name: "add-project",
      component: AddProject,
    },
    {
      path: "/edit-project/:id",
      name: "edit-project",
      component: EditProject,
    },
    {
      path: "/project/:id",
      name: "project",
      component: Project,
    },
  ],
});

export default router;
