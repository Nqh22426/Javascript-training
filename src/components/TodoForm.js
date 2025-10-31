import React, { useContext, useRef } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import TodoContext from '../context/TodoContext';

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

function TodoForm() {
  const { setTodos } = useContext(TodoContext);
  const inputRef = useRef();

  // YUP
  const validationSchema = Yup.object({
    text: Yup.string()
      .trim()
      .required('Task không được để trống!')
      .min(3, 'Task phải có ít nhất 3 ký tự')
      .max(100, 'Task không được quá 100 ký tự'),
  });

  // FORMIK
  const formik = useFormik({
    initialValues: {
      text: '',
    },

    // Schema validation từ Yup
    validationSchema: validationSchema,

    // Xử lý khi submit
    onSubmit: (values, { resetForm }) => {
      const newItem = {
        id: uid(),
        text: values.text.trim(),
        done: false,
        createdAt: Date.now(),
      };

      // Thêm todo mới
      setTodos(prev => [newItem, ...prev]);

      // Reset form về trạng thái ban đầu
      resetForm();

      // Focus lại input để tiếp tục nhập
      if (inputRef.current) {
        inputRef.current.focus();
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="todo-form">
      <div className="form-row">
        <input
          type="text"
          ref={inputRef}
          name="text"
          placeholder="Type your work..."
          
          // Formik tự động quản lý value
          value={formik.values.text}
          
          // Formik tự động quản lý onChange
          onChange={formik.handleChange}
          
          // Formik tự động quản lý onBlur
          onBlur={formik.handleBlur}
          
          className={formik.touched.text && formik.errors.text ? 'error' : ''}
        />
        
        <button type="submit" disabled={formik.isSubmitting}>
          Add
        </button>
      </div>

      {/* Hiển thị lỗi nếu có */}
      {formik.touched.text && formik.errors.text && (
        <div className="error-message">{formik.errors.text}</div>
      )}
    </form>
  );
}

export default TodoForm;