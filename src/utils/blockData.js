// 渐变色
export const color = [
  [
    "linear-gradient(180deg, #FFA9D9 0%, #E83D3D 100%)",
    "linear-gradient(180deg, #F5A8FF 0%, #BF23E5 100%)",
    "linear-gradient(180deg, #C9AAFF 0%, #6D3CF5 100%)",
    "linear-gradient(180deg, #8CD8FF 0%, #2A6AF0 100%)",
    "linear-gradient(180deg, #92FDFF 0%, #14B2DD 100%)",
    "linear-gradient(180deg, #D7FFA7 0%, #5ED52A 100%)",
    "linear-gradient(180deg, #FFDC83 0%, #F88816 100%)",
  ],
  [
    "linear-gradient(180deg, #FFA7EB 0%, #F026A8 100%)",
    "linear-gradient(180deg, #EFA1FF 0%, #9A36F0 100%)",
    "linear-gradient(180deg, #9EAAFF 0%, #3846F4 100%)",
    "linear-gradient(180deg, #7BE7FF 0%, #1E85E2 100%)",
    "linear-gradient(180deg, #89FED8 0%, #18C997 100%)",
    "linear-gradient(180deg, #FFED48 0%, #FD9E16 100%)",
    "linear-gradient(180deg, #FFBA8D 0%, #EB6423 100%)",
  ],
  ["#2B7AF5", "#2B9DF5", "#79CFFF", "#1B67DD", "#4F94FF", "#2180F2", "#3FD0FF"],
];

// 7种方块元素
export const blockMod = (color) => {
  let a = {
    site: [0, 1, 0, 2, 1, 2, 2, 2],
    color: color[0],
  };
  let b = {
    site: [0, 1, 1, 1, 1, 2, 2, 2],
    color: color[1],
  };
  let c = {
    site: [1, 1, 1, 2, 2, 1, 2, 2],
    color: color[2],
  };
  let d = {
    site: [1, 0, 1, 1, 1, 2, 1, 3],
    color: color[3],
  };
  let e = {
    site: [0, 2, 1, 1, 1, 2, 2, 1],
    color: color[4],
  };
  let f = {
    site: [0, 1, 0, 2, 1, 1, 2, 1],
    color: color[5],
  };
  let g = {
    site: [1, 1, 2, 0, 2, 1, 2, 2],
    color: color[6],
  };
  return [a, b, c, d, e, f, g];
};

// 旋转规律
export const transition = [
  [
    { x: 1, y: 1 },
    { x: 1, y: 0 },
    { x: 0, y: -2 },
    { x: -2, y: 1 },
  ],
  [
    { x: 1, y: 1 },
    { x: 1, y: 0 },
    { x: 0, y: -2 },
    { x: -2, y: 1 },
  ],
  [
    { x: 0, y: 1 },
    { x: 1, y: 0 },
    { x: 0, y: -1 },
    { x: -1, y: 0 },
  ],
  [
    { x: -1, y: 2 },
    { x: 1, y: 1 },
    { x: 2, y: -1 },
    { x: -2, y: -2 },
  ],
  [
    { x: 2, y: 0 },
    { x: 0, y: -1 },
    { x: -1, y: -1 },
    { x: -1, y: 2 },
  ],
  [
    { x: 1, y: 1 },
    { x: 1, y: 0 },
    { x: 0, y: -2 },
    { x: -2, y: 1 },
  ],
  [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 0 },
  ],
];
