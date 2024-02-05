<template>
  <MainCard>
    <section>
      <div class="return_button" @click="router.push(`/changelog`)">
        <div class="d-flex align-items-center gap-1">
          <div>
            <svg
              width="13"
              height="10"
              viewBox="0 0 14 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.375 4.5V6.5C10.375 6.59946 10.3355 6.69484 10.2652 6.76517C10.1948 6.83549 10.0995 6.875 10 6.875H4.905L5.765 7.735C5.80184 7.76933 5.83139 7.81073 5.85189 7.85673C5.87239 7.90273 5.88341 7.95239 5.8843 8.00274C5.88518 8.05309 5.87592 8.1031 5.85706 8.1498C5.8382 8.19649 5.81013 8.23891 5.77452 8.27452C5.73891 8.31013 5.69649 8.3382 5.6498 8.35706C5.6031 8.37592 5.55309 8.38518 5.50274 8.3843C5.45239 8.38341 5.40273 8.37239 5.35673 8.35189C5.31073 8.33139 5.26933 8.30184 5.235 8.265L3.735 6.765C3.66477 6.69469 3.62533 6.59938 3.62533 6.5C3.62533 6.40062 3.66477 6.30531 3.735 6.235L5.235 4.735C5.30609 4.66876 5.40011 4.6327 5.49726 4.63441C5.59441 4.63613 5.6871 4.67548 5.75581 4.74419C5.82452 4.8129 5.86387 4.90559 5.86559 5.00274C5.8673 5.09989 5.83124 5.19391 5.765 5.265L4.905 6.125H9.625V4.5C9.625 4.40054 9.66451 4.30516 9.73483 4.23484C9.80516 4.16451 9.90054 4.125 10 4.125C10.0995 4.125 10.1948 4.16451 10.2652 4.23484C10.3355 4.30516 10.375 4.40054 10.375 4.5ZM13.375 1.5V10.5C13.375 10.7321 13.2828 10.9546 13.1187 11.1187C12.9546 11.2828 12.7321 11.375 12.5 11.375H1.5C1.26794 11.375 1.04538 11.2828 0.881282 11.1187C0.717187 10.9546 0.625 10.7321 0.625 10.5V1.5C0.625 1.26794 0.717187 1.04538 0.881282 0.881282C1.04538 0.717187 1.26794 0.625 1.5 0.625H12.5C12.7321 0.625 12.9546 0.717187 13.1187 0.881282C13.2828 1.04538 13.375 1.26794 13.375 1.5ZM12.625 1.5C12.625 1.46685 12.6118 1.43505 12.5884 1.41161C12.5649 1.38817 12.5332 1.375 12.5 1.375H1.5C1.46685 1.375 1.43505 1.38817 1.41161 1.41161C1.38817 1.43505 1.375 1.46685 1.375 1.5V10.5C1.375 10.5332 1.38817 10.5649 1.41161 10.5884C1.43505 10.6118 1.46685 10.625 1.5 10.625H12.5C12.5332 10.625 12.5649 10.6118 12.5884 10.5884C12.6118 10.5649 12.625 10.5332 12.625 10.5V1.5Z"
                fill="#0F172A"
              />
            </svg>
          </div>
          <div style="color: #0f172a">Return</div>
        </div>
      </div>
      <div class="d-flex align-items-center justify-content-between">
        <div class="d-flex flex-column">
          <div class="changelog_version">
            Version {{ changelogData.version }}
          </div>
          <div class="d-flex gap-3">
            <div class="changelog_author">By {{ changelogData.author }}</div>
            <div class="changelog_date d-flex align-items-center gap-1">
              <svg
                width="18"
                height="17"
                viewBox="0 0 18 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_6080_40269)">
                  <g clip-path="url(#clip1_6080_40269)">
                    <g clip-path="url(#clip2_6080_40269)">
                      <path
                        d="M9.22148 0C4.52948 0 0.72998 3.808 0.72998 8.5C0.72998 13.192 4.52948 17 9.22148 17C13.922 17 17.73 13.192 17.73 8.5C17.73 3.808 13.922 0 9.22148 0ZM9.22998 15.3C5.47298 15.3 2.42998 12.257 2.42998 8.5C2.42998 4.743 5.47298 1.7 9.22998 1.7C12.987 1.7 16.03 4.743 16.03 8.5C16.03 12.257 12.987 15.3 9.22998 15.3ZM9.04298 4.25H8.99198C8.65198 4.25 8.37998 4.522 8.37998 4.862V8.874C8.37998 9.1715 8.53298 9.452 8.79648 9.605L12.324 11.7215C12.613 11.8915 12.987 11.8065 13.157 11.5175C13.3355 11.2285 13.242 10.846 12.9445 10.676L9.65498 8.721V4.862C9.65498 4.522 9.38298 4.25 9.04298 4.25Z"
                        fill="white"
                      />
                    </g>
                  </g>
                </g>
                <defs>
                  <clipPath id="clip0_6080_40269">
                    <rect
                      width="17"
                      height="17"
                      fill="white"
                      transform="translate(0.72998)"
                    />
                  </clipPath>
                  <clipPath id="clip1_6080_40269">
                    <rect
                      width="17"
                      height="17"
                      fill="white"
                      transform="translate(0.72998)"
                    />
                  </clipPath>
                  <clipPath id="clip2_6080_40269">
                    <rect
                      width="17"
                      height="17"
                      fill="white"
                      transform="translate(0.72998)"
                    />
                  </clipPath>
                </defs>
              </svg>
              {{ changelogData.date }}
            </div>
          </div>
        </div>
        <div>
          <img :src="d3logo" />
        </div>
      </div>
      <hr style="border: 1px solid #262626e5" />

      <div>
        <div class="changelog_text_header">
          The standard Lorem Ipsum passage, used since the 1500s
        </div>
        <p class="changelog_text_desc">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>

        <div class="changelog_text_header">
          Section 1.10.32 of "de Finibus Bonorum et Malorum", written by Cicero
          in 45 BC.
        </div>
        <p class="changelog_text_desc">
          But I must explain to you how all this mistaken idea of denouncing
          pleasure and praising pain was born and I will give you a complete
          account of the system, and expound the actual teachings of the great
          explorer of the truth, the master-builder of human happiness. No one
          rejects, dislikes, or avoids pleasure itself, because it is pleasure,
          but because those who do not know how to pursue pleasure rationally
          encounter consequences that are extremely painful. Nor again is there
          anyone who loves or pursues or desires to obtain pain of itself,
          because it is pain, but because occasionally circumstances occur in
          which toil and pain can procure him some great pleasure. To take a
          trivial example, which of us ever undertakes laborious physical
          exercise, except to obtain some advantage from it? But who has any
          right to find fault with a man who chooses to enjoy a pleasure that
          has no annoying consequences, or one who avoids a pain that produces
          no resultant pleasure?
        </p>
        <div class="changelog_text_header">1914 translation by H. Rackham</div>
        <p class="changelog_text_desc">
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem
          accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae
          ab illo inventore veritatis et quasi architecto beatae vitae dicta
          sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
          aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos
          qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui
          dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed
          quia non numquam eius modi tempora incidunt ut labore et dolore magnam
          aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum
          exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex
          ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in
          ea voluptate velit esse quam nihil molestiae consequatur, vel illum
          qui dolorem eum fugiat quo voluptas nulla pariatur?
        </p>

        <div class="changelog_text_header">
          Section 1.10.32 of "de Finibus Bonorum et Malorum", written by Cicero
          in 45 BC.
        </div>
        <p class="changelog_text_desc">
          But I must explain to you how all this mistaken idea of denouncing
          pleasure and praising pain was born and I will give you a complete
          account of the system, and expound the actual teachings of the great
          explorer of the truth, the master-builder of human happiness. No one
          rejects, dislikes, or avoids pleasure itself, because it is pleasure,
          but because those who do not know how to pursue pleasure rationally
          encounter consequences that are extremely painful. Nor again is there
          anyone who loves or pursues or desires to obtain pain of itself,
          because it is pain, but because occasionally circumstances occur in
          which toil and pain can procure him some great pleasure. To take a
          trivial example, which of us ever undertakes laborious physical
          exercise, except to obtain some advantage from it? But who has any
          right to find fault with a man who chooses to enjoy a pleasure that
          has no annoying consequences, or one who avoids a pain that produces
          no resultant pleasure?
        </p>
      </div>

      <hr style="border: 1px solid #262626e5" />
      <div>
        <div class="changelog_footer mb-3">Read other changelogs</div>
        <div class="d-flex align-items-center gap-2">
          <div v-for="(item, i) in relatedChangelogs()" :key="`related-${i}`">
            <a :href="`/changelog/${ item.id }`" class="changelog_related">
              Version {{ item.version }}
            </a>
          </div>
        </div>
      </div>
    </section>
  </MainCard>
</template>
<script setup>
import MainCard from '@/UI/MainCard.vue'
import changelogsData from '@/assets/files_mocks/changelogs.json'
import { useRoute } from 'vue-router'
import router from '@/router'
import d3logo from '@/assets/brand/d3logo_changelogs.svg'


const Route = useRoute()

// const changelogData = changelogsData.find(ob=>(ob.id === Route.path.split("/").pop()))
const changelogData = changelogsData.find(
  (obj) => obj.id === Number(Route.path.split('/').pop()),
)

function relatedChangelogs() {
  return changelogsData.slice(0, 5).filter((x) => {
    return x.id != changelogData.id
  })
}

console.log(changelogData)
</script>
<style lang="scss" scoped>
.changelog {
  &_version {
    font-family: Poppins;
    font-size: clamp(24px, 0.8vw, 29px);
    font-weight: 700;
    line-height: 40px;
    color: #ffffff;
  }
  &_author {
    font-family: Poppins;
    font-size: clamp(12px, 0.8vw, 14px);
    font-weight: 700;
    line-height: 20px;
    color: #7ef6b2;
  }
  &_date {
    font-family: Poppins;
    font-size: clamp(12px, 0.8vw, 14px);
    font-weight: 400;
    line-height: 20px;
    color: #ffffff;
  }

  &_text_header {
    font-family: Poppins;
    font-size: clamp(13px, 0.8vw, 17px);
    font-weight: 700;
    line-height: 30px;
    color: #ffffff;
  }
  &_text_desc {
    font-family: Poppins;
    font-size: clamp(11px, 0.8vw, 15px);
    font-weight: 300;
    line-height: 20px;
    color: #969696;
  }

  &_footer {
    font-family: Poppins;
    font-size: clamp(18px, 0.7vw, 24px);
    font-weight: 700;
    line-height: 30px;
    color: #ffffff;
  }
  &_related {
    border: 1px solid #7ef6b2;
    padding: 2px 6px;
    text-decoration: none;
    border-radius: 20px;
    font-family: Inter;
    font-size: clamp(10px, 0.8vw, 14px);
    font-weight: 700;
    line-height: 20px;
    color: #666666;
    width: fit-content;
    &:hover {
      color: #7ef6b2;
      cursor: pointer;
    }
  }
}

.return_button {
  box-shadow: 0px 1px 2px 0px #0000000d;
  background: #00dc82;
  padding: 3px 7px;
  width: fit-content;
  border-radius: 6px;
  margin-bottom: 5px;
  font-size: clamp(10px, 0.8vw, 12px);
  font-weight: 500;
  line-height: 16px;
  cursor: pointer;

  &:hover {
    filter: drop-shadow(0 0 0.3rem #00dc82);
  }
}
</style>
