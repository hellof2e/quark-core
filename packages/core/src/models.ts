type TypeHint = typeof Boolean | typeof Number | typeof String;
export type converterFunction = (val: any, type?: TypeHint) => any;

export interface PropertyDeclaration {
  /**
   * Whether the property is Reactive and watches for the attribute change. It will be added to {@link https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#responding_to_attribute_changes observedAttributes} automatically
   * 
   * 是否响应式属性，接收外部的参数变化，会自动加入{@link https://developer.mozilla.org/zh-CN/docs/Web/API/Web_components/Using_custom_elements#%E5%93%8D%E5%BA%94%E5%B1%9E%E6%80%A7%E5%8F%98%E5%8C%96 observedAttributes}数组中
   */
  readonly observed?: boolean | string;
  /**
   * Specify the type of the property,
   * and then quarkc will transform string attribute value to specified type automatically.
   * 
   * Boolean property's default value will be ignored (defaults to 'false'), to line up with HTML standard.
   * 
   * 属性类型，会针对类型做不同的特殊处理。Boolean, Number, String
   * 
   * 布尔值属性设置的默认值会被忽略（默认值为false）
   * 
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
  /** 是否为组件内部属性——不作为HTML属性传递 */
  readonly internal?: boolean;
}
