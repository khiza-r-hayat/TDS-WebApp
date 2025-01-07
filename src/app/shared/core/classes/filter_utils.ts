export class FilterUtils {
  static filterArrayByQuery<T extends object>(
    items: T[],
    query: string,
    excludeKeys: (keyof T | string)[] = []
  ): T[] {
    if (!items.length || !query) {
      return items;
    }

    const searchQuery = query.toLowerCase().trim();

    return items.filter((item) => {
      const keys = Object.keys(item).filter(
        (key) => !excludeKeys.includes(key)
      );

      return keys.some((key) => {
        const value = item[key as keyof T];

        if (value === null || value === undefined) {
          return false;
        }

        if (typeof value === "object") {
          return JSON.stringify(value).toLowerCase().includes(searchQuery);
        }

        if (Array.isArray(value)) {
          return value.some((v) =>
            String(v).toLowerCase().includes(searchQuery)
          );
        }

        return String(value).toLowerCase().includes(searchQuery);
      });
    });
  }

  ////////////////////////////////////////////////////////////////////////////////
  //@useage                                                                     //
  //                                                                            //
  // FilterUtils.filterArrayByFields(users, {                                   //
  //    age: (age: number) => age > 25,                                         //
  //    tags: (tags: string[]) => tags.includes("premium")                      //
  //  });                                                                       //
  ////////////////////////////////////////////////////////////////////////////////

  static filterArrayByFields<T extends object>(
    items: T[],
    conditions: { [K in keyof T]?: (value: T[K]) => boolean }
  ): T[] {
    return items.filter((item) => {
      return (Object.entries(conditions) as [
        keyof T,
        (value: any) => boolean
      ][]).every(([field, condition]) => {
        return condition(item[field]);
      });
    });
  }

  // public static applyDynamicLogicalOperations(
  //   paramList: any[],
  //   operators: boolean[]
  // ): boolean {
  //   //first index of list should be a statement is required statement for filter rest can be optional
  //   let result = paramList[0];

  //   if (!result) return false;

  //   for (let i = 1; i < paramList.length; i++) {
  //     if (operators[i - 1]) {
  //       result = result && paramList[i];
  //     } else {
  //       result = result || paramList[i];
  //     }
  //   }
  //   return result;
  // }
}
