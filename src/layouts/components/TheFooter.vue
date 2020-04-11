<template functional>
    <footer class="the-footer flex-wrap justify-between" :class="classes">
        <p>
          <span>powered by </span>
          <a href="https://basma.ai" target="_blank" rel="nofollow">basma.ai</a>
        </p>
        <span class="md:flex hidden items-center">
            <span>developed with</span>
            <feather-icon icon="HeartIcon" svgClasses="stroke-current text-danger w-6 h-6" class="ml-2" style="padding-right: 5px" />
            <span>in Bahrain</span>
        </span>
    </footer>
</template>

<script>
export default {
    name: "the-footer",
    props: {
        classes: {
            type: String,
        }
    }
}
</script>
