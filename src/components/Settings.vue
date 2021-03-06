<script lang="ts" setup>
import Modal from "./Modal.vue";
import SettingsTile from "./SettingTile.vue";

import { useStore } from "vuex";
import { computed, ref } from "vue";

import scan from "../assets/icons/scan.svg";
import chunk from "../assets/icons/chunk.svg";
import nav from "../assets/icons/nav.svg";
import titlebar from "../assets/icons/titlebar.svg";

import osxDark from "../assets/icons/osx-dark.png";
import osxLight from "../assets/icons/osx-light.png";
import winLight from "../assets/icons/win-light.png";
import winDark from "../assets/icons/win-dark.png";

const store = useStore();

// Variables

const isDark = computed(() => store.getters["config/isDark"]);
const settings = [
  {
    icon: titlebar,
    title: "Titlebar",
    caption: "Customizes titlebar style",
    expandable: true,
    expansion: 450,
  },
  {
    icon: nav,
    title: "Navigation Bar",
    caption: "Configures navigation hover",
    expandable: true,
  },
  {
    icon: scan,
    title: "Scanning Interval",
    caption: "Configures the time between listeners",
    expandable: true,
  },
  {
    icon: chunk,
    title: "Chunks",
    caption: "Amount of logs to lazy load of a time",
    expandable: true,
  },
];

// Computed
const isSettingsOpen = computed(() => store.getters["isSettingsOpen"]);

const config = computed(() => store.getters["config/config"]);

// Functions
const closeModal = () => store.dispatch("toggleSettings", false);

const toggleNavbarOption = (option: string) => {
  store.dispatch("config/setPinNavbar", option);
};

const toggleTitlebar = (option: string) => {
  store.dispatch("config/setTitlebar", option);
};

type ActionType = "interval" | "chunks";
const updateConfig = (e: Event, action: ActionType) => {
  const target = e.target;

  switch (action) {
    case "interval":
      store.dispatch(
        "config/setInterval",
        Number((<HTMLInputElement>target).value) * 100
      );
      break;

    case "chunks":
      store.dispatch("config/setChunks", (<HTMLInputElement>target).value);
      break;
  }
};
</script>

<template>
  <Modal v-if="isSettingsOpen" class="overflow-hidden">
    <template #modal>
      <div
        class="dialog w-[80%] h-[80%] max-h-[550px] max-w-[1000px] relative rounded-xl bg-l_primary dark:bg-d_primary p-8 pt-5"
      >
        <div
          class="left--block bg-l_primary rounded-bl-lg z-30 rounded-tl-lg dark:bg-d_primary w-[50%] h-full absolute left-0 top-0"
        />
        <div
          class="right--block rounded-tr-lg rounded-br z-30 bg-l_primary dark:bg-d_primary w-[50%] h-full absolute right-0 top-0"
        />

        <div class="container absolute flex justify-end right-8">
          <button
            @click="closeModal"
            class="bg-[#ffffff] dark:text-gray-200 dark:bg-d_secondary px-3 py-1 rounded-md shadow-lg"
          >
            Close
          </button>
        </div>

        <header class="text-2xl mb-6 font-comfortaa dark:text-gray-200">
          Settings
        </header>

        <section
          class="flex flex-col overflow-y-auto h-[calc(100%-30px)] relative"
        >
          <SettingsTile v-for="setting in settings" v-bind="{ ...setting }">
            <!-- Titlebar -->
            <div v-if="setting.title == 'Titlebar'">
              <div class="flex flex-col">
                <!-- Macintosh Option -->
                <div class="ml-16 mb-4" @click="toggleTitlebar('macos')">
                  <input
                    :checked="config.titlebar == 'macos'"
                    class="mr-1"
                    type="radio"
                    name="titlebar"
                  />
                  <label>Macintosh Style</label>
                  <img :src="isDark ? osxDark : osxLight" />
                </div>

                <!-- Windows Option -->
                <div class="ml-16 mb-2" @click="toggleTitlebar('win32')">
                  <input
                    :checked="config.titlebar == 'win32'"
                    class="mr-1"
                    type="radio"
                    name="titlebar"
                  />
                  <label>Windows Style</label>
                  <img :src="isDark ? winDark : winLight" alt="" />
                </div>
              </div>
            </div>

            <!-- Navigation Bar -->
            <div
              class="flex items-center pt-2"
              v-if="setting.title == 'Navigation Bar'"
            >
              <div class="ml-16" @click="toggleNavbarOption('pin')">
                <input
                  :checked="config.pinNavbar == 'pin'"
                  class="mr-1"
                  type="radio"
                  name="status"
                  value="pin"
                />
                <span>Pin NavBar</span>
              </div>

              <div class="pl-10" @click="toggleNavbarOption('unpin')">
                <input
                  :checked="config.pinNavbar == 'unpin'"
                  class="mr-1"
                  type="radio"
                  name="status"
                  value="unpin"
                />
                <span>Unpin Navbar</span>
              </div>
            </div>
            <!-- Scanning Interval -->
            <div
              v-if="setting.title == 'Scanning Interval'"
              class="flex h-full pb-1 pt-2"
            >
              <input
                type="range"
                min="1"
                max="600"
                @input="(e) => updateConfig(e, 'interval')"
                :value="config.scanningInterval / 100"
                class="w-[70%] ml-16 mr-1"
              />

              {{ config.scanningInterval }}ms
            </div>

            <!-- Chunks -->
            <div
              v-else-if="setting.title == 'Chunks'"
              class="flex h-full pb-1 pt-2"
            >
              <input
                type="range"
                min="1"
                max="100"
                @input="(e) => updateConfig(e, 'chunks')"
                :value="config.chunks"
                class="w-[70%] ml-16 mr-1"
              />

              {{ config.chunks }} chunk(s)
            </div>
          </SettingsTile>
        </section>
      </div>
    </template>
  </Modal>
</template>

<style scoped>
button {
  box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
}
</style>
