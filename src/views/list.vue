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

const ROUTE_LIST = "routeLists";

function _initData() {
  return {
    topics: [],
    searchKey: {
      //路由参数
      page: 1,
      limit: 10,
      tab: "all",
      mdrender: true
    }
  };
}
export default {
  filters: {
    getLastTimeStr(time, isFromNow) {
      return utils.getLastTimeStr(time, isFromNow);
    }
  },
  data() {
    return _initData();
  },
  created() {
    this.initData();
  },
  mounted() {
    //添加滚动事件
    window.addEventListener(
      "scroll",
      utils.throttle(this.scrollMethod, 1000, 500)
    );
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === "topic") {
      window.sessionStorage.setItem(
        ROUTE_LIST,
        JSON.stringify({
          scrollTop: document.documentElement.scrollTop,
          topics: this.topics,
          searchKey: this.searchKey,
          tab: to.query.tab || "all"
        })
      );
    }
    //取消滚动事件
    window.removeEventListener(
      "scroll",
      utils.throttle(this.scrollMethod, 1000, 500)
    );
    next();
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    $route: function(to, from) {
      this.initData(true);
      // this.getTopics();
      // 隐藏导航栏
      this.$refs.head.show = false;
    }
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
    /**@augments
     * 初始化 data，并通过route得到数据
     */
    initData(isTypes) {
      const routeLists = JSON.parse(window.sessionStorage.getItem(ROUTE_LIST));
      debugger;
      if (routeLists && !isTypes) {
        this.topics = routeLists.topics;
        this.searchKey = routeLists.searchKey;
        if (this.$route.query && this.$route.query.tab) {
          this.searchKey.tab = this.$route.query.tab;
        }
         this.$nextTick(() => document.documentElement.scrollTop=routeLists.scrollTop|| 0);
      } else {
        this.topics = _initData().topics;
        this.searchKey = _initData().searchKey;
        if (this.$route.query && this.$route.query.tab) {
          this.searchKey.tab = this.$route.query.tab;
        }
        // 组件创建完后获取数据，
        // 此时 data 已经被 observed 了
        this.getTopics();
      }
      //this.$data 不能更改整体
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