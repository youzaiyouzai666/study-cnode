<template>
    <div>
        <!-- 全局header -->
        <nv-head :page-type="getTitleStr(searchKey.tab)"
                ref="head"
                :fix-head="true"
                :need-add="true">
        </nv-head>

        <section id="page">
            <!-- 首页列表 -->
            <ul class="posts-list">
                <li v-for="item in topics" :key="item.id">
                    <router-link :to="{name:'topic',params:{id:item.id}}">
                    <h3 v-text="item.title"
                            :class="getTabInfo(item.tab, item.good, item.top, true)"
                            :title="getTabInfo(item.tab, item.good, item.top, false)">
                    </h3>
                    <div class="content">
                        <img class="avatar" :src="item.author.avatar_url" />
                        <div class="info">
                            <p>
                                <span class="name">
                                    {{item.author.loginname}}
                                </span>
                                <span class="status" v-if="item.reply_count > 0">
                                    <b>{{item.reply_count}}</b>
                                    /{{item.visit_count}}
                                </span>
                            </p>
                            <p>
                                <time>{{item.create_at | getLastTimeStr(true)}}</time>
                                <time>{{item.last_reply_at | getLastTimeStr(true)}}</time>
                            </p>
                        </div>
                    </div>
                    </router-link>
                </li>
            </ul>
        </section>
        <!-- <nv-top></nv-top> -->
    </div>
</template>

<script>
import utils from "@/lib/util.js";
import nvHead from "@/components/header.vue";

export default {
  filters: {
    getLastTimeStr(time, isFromNow) {
      return utils.getLastTimeStr(time, isFromNow);
    }
  },
  data() {
    return {
      topics: [],
      searchKey: {
        page: 1,
        limit: 10,
        tab: "all",
        mdrender: true
      }
    };
  },
  created() {
    // 组件创建完后获取数据，
    // 此时 data 已经被 observed 了
    this.getTopics();
  },
  mounted() {
    window.addEventListener(
      "scroll",
      utils.throttle(this.scrollMethod, 1000, 500)
    );
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    $route: "getTopics"
  },
  methods: {
    // 获取title文字
    getTitleStr(tab) {
      let str = "";
      switch (tab) {
        case "share":
          str = "分享";
          break;
        case "ask":
          str = "问答";
          break;
        case "job":
          str = "招聘";
          break;
        case "good":
          str = "精华";
          break;
        default:
          str = "全部";
          break;
      }
      return str;
    },
    // 获取主题数据
    getTopics() {
      //   let params = $.param(this.searchKey);
      this.axios.get("/topics", { params: this.searchKey }).then(d => {
        console.log(d);
        if (d && d.data && d.data.data) {
          d.data.data.forEach(this.mergeTopics);
        }
      });
    },
    // 获取不同tab的样式或者标题
    getTabInfo(tab, good, top, isClass) {
      return utils.getTabInfo(tab, good, top, isClass);
    },
    mergeTopics(topic) {
      this.topics.push(topic);
    },
    scrollMethod() {
      const scrollH = document.body.scrollHeight;
      const viewH = document.documentElement.clientHeight;
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollH - (scrollTop + viewH) <= 60) {
        this.searchKey.page += 1;
        this.getTopics();
      }
    }
  },
  components: {
    nvHead
  }
};
</script>