<template>
        <footer class="mb-1 mx-3 small" style="position: fixed; bottom: 0; left: 0;">
        <p>
            <font-awesome-icon icon="circle" v-bind:class="this.systemStatus" />
            {{ this.getSystemStatus() }}
        </p>
    </footer>
</template>

<script>

export default {
    name: "SystemStatus",
    props: ["systemStatus"],
    methods: {
        getSystemStatus() {
            if (this.systemStatus == "online") {
                return "System online";
            } else {
                return "System offline";
            }
        }
    }

}

</script>
<style scoped>
.online {
    color: rgb(0, 204, 0);
}

.offline {
    color: rgb(170, 20, 20);
}
</style>
