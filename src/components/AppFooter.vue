<template>
  <CFooter class="footer">
    <div class="d-flex justify-content-end gap-2 w-100">
      <a href="https://twitter.com/D3_firm" target="_blank">
        <div class="link_logo">
          <img :src="twitterIcon" />
        </div>
      </a>
      <a href="https://twitter.com/D3_firm" target="_blank">
        <div class="link_logo">
          <img :src="discordIcon" />

        </div>
      </a>
      <a href="https://medium.com/@D3_Innovations" target="_blank">
        <div class="link_logo">
          <img :src="mediumIcon" />

        </div>
      </a>
      <a href="mailto:team@d3vs.xyz?subject=Contact" target="_blank">
        <div class="link_logo">
          <img :src="githubIcon" />
        </div>
      </a>
      <a href="mailto:team@d3vs.xyz?subject=Contact" target="_blank">
        <div class="link_logo">
          <img :src="contactIcon" />
        </div>
      </a>
    </div>
    <div class="d-flex justify-content-between mt-5 w-100">
      <div class="flex gap-2 footer_text">
        <div class="flex gap-1 items-center">
          About
          <img :src="footerLinkIcon" />
        </div>
        <div class="flex gap-1 items-center">
          Docs
          <img :src="footerLinkIcon" />
        </div>
        <div class="flex gap-1 items-center">
          Bug bounty
          <img :src="footerLinkIcon" />
        </div>
        <div class="flex gap-1 items-center">
          Analytics
          <img :src="footerLinkIcon" />
        </div>
      </div>
      <div class="d-flex gap-3 footer_text">
        <div>Terms of Use</div>
        <div>Privacy Policy</div>
        <div>Cookies Policy</div>
        <div>Risks</div>
      </div>
    </div>
  </CFooter>
</template>

<script setup>
import footerLinkIcon from '@/assets/icons/Footer/footer_link.svg'
import contactIcon from '@/assets/icons/Footer/contact.svg'
import discordIcon from '@/assets/icons/Footer/discord.svg'
import githubIcon from '@/assets/icons/Footer/github.svg'
import mediumIcon from '@/assets/icons/Footer/medium.svg'
import twitterIcon from '@/assets/icons/Footer/twitter.svg'

</script>
<style lang="scss" scoped>
.footer {
  background: #0c0c0c3d;
  border: none;
  width: 100%;
  padding: 30px 80px;
  box-shadow: 0px 4px 8.899999618530273px 0px #000000b5;

}

.link_logo {
  width: 32px;
  height: 32px;
  background: #22222299;
  box-shadow: 0px 4px 8.899999618530273px 0px #000000b5;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.link_logo:hover svg path {
  fill: #00c9ff;
}

.footer_text {
  font-family: Inter;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #FFFFFF;
  &:hover {
    cursor: pointer;
  }
}
</style>
