const InvManage = (function(){
  let items = [];
  let idCounter = 1;

  // Kiểm tra object hợp lệ
  function checkItem(obj){
    if (typeof obj !== 'object' || obj === null){
      throw new Error("Item must be an object and not null");
    }
  }

  // Tìm index trong mảng items theo id
  function indexOfId(id){
    for (let i = 0; i < items.length; i += 1){
      if (items[i].id === id){
        return i;
      }
    }
    return -1;
  }


  // Thêm item
  function addItem(obj = {}){
    const {name = "Untitled", quantity = 0, price = 0} = obj;

    try{
      // Kiểm tra obj hợp lệ
      checkItem(obj);

      // Tạo item mới
      const newItem = {
        id: idCounter,
        name: String(name),
        quantity: Number(quantity),
        price: Number(price)
      };

      // Đẩy vào mảng
      items.push(newItem);
      idCounter = idCounter + 1;

      console.log("Add new item:", newItem);
      return newItem;
    } catch (err){
      console.error("Add Failed!", err.message);
      throw err;
    }
  }

  // Liệt kê tất cả item
  function listItem(){
    const view = items.map(function (list){
      const {id, name, quantity, price} = list;
      return {id, name, quantity, price};
    });
    console.log("All items:", view);
    return view;
  }

  // Tìm item theo tên
  function findName(nameQuery){
    const results = []; // lưu kết quả
    for (let i = 0; i < items.length; i += 1){
      if (String(items[i].name).indexOf(String(nameQuery)) !== -1) {
        results.push(items[i]);
      }
    }
    console.log("Find result for", nameQuery, ":", results);
    return results;
  }

  // Lấy item theo id
  function getItem(id){
    const idx = indexOfId(id);
    if (idx === -1){
      console.warn("Cannot found item id:", id);
      return null;
    }
    return items[idx];
  }

  // Cập nhật item theo id
  function updateItem(id, change = {}){ //change chứa các field muốn đổi
    const idx = indexOfId(id);
    if (idx === -1){
      throw new Error("Cannot found item id: " + id + " to update");
    }

    const current = items[idx];
    const{
      name = current.name,
      quantity = current.quantity,
      price = current.price
    } = change;

    const updated = {
      ...current,
      name: String(name),
      quantity: Number(quantity),
      price: Number(price)
    };

    // Đẩy lại vào mảng
    items[idx] = updated;
    console.log("Updated id:", id, "=>", updated);
    return updated;
  }

  // Xóa item theo id
  function removeItem(id){
    const idx = indexOfId(id);
    if (idx === -1){
      throw new Error("Cannot found item id: " + id + " to remove");
    }

    const removed = items.splice(idx, 1)[0];
    console.log("Removed:", removed);
    return removed;
  }

  
  return{
    addItem,
    listItem,
    findName,
    getItem,
    updateItem,
    removeItem,
  };

})();