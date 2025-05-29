import { createApp } from "vue";
import "./style.css";
import "./assets/main.css";

import App from "./App.vue";
import router from "./router";
import Vue3ColorPicker from "vue3-colorpicker";
import "vue3-colorpicker/style.css";

// Import Font Awesome core
import { library } from "@fortawesome/fontawesome-svg-core";

// Import specific icons
import {
  faHouseLaptop,
  faProjectDiagram,
  faTasksAlt,
  faCircleCheck,
  faDashboard,
  faUserCircle,
  faTasks,
  faTableColumns,
  faUser,
  faBars,
  faSignOutAlt,
  faNoteSticky,
  faKey,
  faRightFromBracket,
  faRefresh,
  faAdd,
  faGrip,
  faList,
  faPeopleGroup,
  faTrashCan,
  faClipboardList,
  faClipboardCheck,
  faTableCellsLarge,
  faTimeline,
  faBug,
  faComment,
  faHexagonNodes,
  faLaptopCode,
  faCubes,
  faEllipsisVertical,
  faGear,
  faGears,
} from "@fortawesome/free-solid-svg-icons";

//Font Awesome component
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faPaste } from "@fortawesome/free-regular-svg-icons";
library.add(
  faGear,
  faGears,
  faPaste,
  faEllipsisVertical,
  faCubes,
  faLaptopCode,
  faHexagonNodes,
  faComment,
  faBug,
  faTimeline,
  faClipboardCheck,
  faClipboardList,
  faTrashCan,
  faPeopleGroup,
  faList,
  faGrip,
  faAdd,
  faRefresh,
  faRightFromBracket,
  faKey,
  faHouseLaptop,
  faNoteSticky,
  faProjectDiagram,
  faTasksAlt,
  faCircleCheck,
  faDashboard,
  faUserCircle,
  faTasks,
  faTableColumns,
  faUser,
  faBars,
  faSignOutAlt,
  faTableCellsLarge
);

createApp(App)
  .component("font-awesome-icon", FontAwesomeIcon)
  .use(router)
  .use(Vue3ColorPicker)
  .mount("#app");
