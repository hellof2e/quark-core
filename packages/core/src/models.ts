type TypeHint = typeof Boolean | typeof Number | typeof String;
export type converterFunction = (val: any, type?: TypeHint) => any;

export interface PropertyDeclaration {
  /**
   * 是否响应式属性，接收外部的参数变化，会自动加入observedAttributes数组中
   */
  readonly observed?: boolean | string;
  /**
   * 属性类型，会针对类型做不同的特殊处理。
   * Boolean, Number, String
   */
  readonly type?: TypeHint;
  /**
   * 从外部获取属性时的值转换方法
   */
  readonly converter?: converterFunction;
  /**
   * 创建内部属性名和外部属性名不同时，可以通过改属性指定外部属性名称
   */
  readonly attribute?: string;
}
