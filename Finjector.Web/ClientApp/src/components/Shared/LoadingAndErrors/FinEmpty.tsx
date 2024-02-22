interface FinEmptyProps {
  title?: string;
  children?: React.ReactNode;
}

const FinEmpty: React.FC<FinEmptyProps> = ({ title, children }) => {
  return (
    <div className="emptygraphic-wrapper">
      <svg
        width="119px"
        height="141px"
        viewBox="0 0 119 141"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>empty-state</title>
        <g
          id="Main"
          stroke="none"
          strokeWidth="1"
          fill="none"
          fillRule="evenodd"
        >
          <g id="1.0/empty-states" transform="translate(-544, -492)">
            <g id="empty-state" transform="translate(544, 492)">
              <ellipse
                id="shadow"
                fill="#E5E5E5"
                cx="55.5"
                cy="133"
                rx="55.5"
                ry="8"
              ></ellipse>
              <g id="float-emptystate">
                <path
                  d="M8,28 C3.58833333,28 0,31.7004687 0,36.25 L0,47.25 C0,48.769375 1.19333333,50 2.66666667,50 L16,50 L16,36.25 C16,31.7004687 12.4116667,28 8,28 Z M43.3794778,97.6215031 L43.3794778,87.4002692 L92,87.4002692 L92,44.2000734 C92,35.2664079 84.7305566,28 75.7931593,28 L19,28 C20.7135358,30.2629478 21.7703568,33.0490229 21.7703568,36.1000367 L21.7703568,98.2003182 C21.7703568,104.75966 27.6200134,109.953809 34.3897458,108.851866 C39.7025508,107.987863 43.3794778,103.002965 43.3794778,97.6215031 Z M49.0714286,92 L49.0714286,97.5 C49.0714286,106.597344 41.8627232,114 33,114 L89.25,114 C99.6060268,114 108,105.382188 108,94.75 C108,93.230625 106.801339,92 105.321429,92 L49.0714286,92 Z"
                  id="scroll"
                  fill="#C5C5C5"
                  fill-rule="nonzero"
                ></path>
                <g id="pencil" transform="translate(54, 0)" fillRule="nonzero">
                  <g id="Group" transform="translate(0, -0)">
                    <path
                      d="M55.836409,9.07763541 C53.8195779,7.06350875 51.1428375,5.95573909 48.2911814,5.95573909 C45.4448258,5.95573909 42.762785,7.06350875 40.7486041,9.08028557 L10.5120389,39.3160369 C10.1728085,39.6552582 9.93163682,40.0792849 9.81502635,40.5457142 L6.03313674,55.6622648 C5.81051675,56.5659716 6.07554055,57.5226818 6.73279957,58.177273 C7.38740835,58.8371644 8.3467945,59.1021811 9.24787542,58.8769169 L24.3674831,55.0951291 C24.8312748,54.981172 25.2579631,54.7373566 25.5971936,54.3981353 L55.8337587,24.162384 C57.8479396,22.1482573 58.9557391,19.4662887 58.9557391,16.6200097 C58.9557391,13.7710805 57.8479396,11.0891119 55.8311085,9.07498524 L55.836409,9.07763541 Z"
                      id="border"
                      fill="#9A9A9A"
                      transform="translate(32.4557, 32.4557) rotate(-15) translate(-32.4557, -32.4557)"
                    ></path>
                    <path
                      d="M37.5149883,11.0279137 L39.5944667,8.95426753 C41.8039124,6.74776933 45.6567237,6.74776933 47.8661695,8.95426753 L47.8603931,8.94849135 C50.0698389,11.1578776 50.0698389,15.0105852 47.8603931,17.2228595 L45.7866911,19.2993939 L37.5149883,11.0279137 Z"
                      id="Path"
                      fill="#FFFFFF"
                      transform="translate(43.5162, 13.2994) rotate(-15) translate(-43.5162, -13.2994)"
                    ></path>
                    <polygon
                      id="Path"
                      fill="#FFFFFF"
                      transform="translate(21.1305, 52.072) rotate(-15) translate(-21.1305, -52.072)"
                      points="18.6303831 47.0719698 24.8797607 48.3211792 26.1321663 54.5703885 16.1287345 57.0719698"
                    ></polygon>
                    <polygon
                      id="Path"
                      fill="#FFFFFF"
                      points="22.7625593 43.5966781 19.2819944 43.8233924 35.1978949 16.2611021 37.7128783 17.7107732"
                    ></polygon>
                    <polygon
                      id="Path"
                      fill="#FFFFFF"
                      points="27.6630463 46.4281977 42.6099 20.5402923 45.1241511 21.9872305 29.2089829 49.5522537"
                    ></polygon>
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
      <p>{title ?? "There are no items in this list."}</p>
    </div>
  );
};

export default FinEmpty;
