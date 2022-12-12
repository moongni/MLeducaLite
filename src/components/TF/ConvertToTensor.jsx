import * as tf from "@tensorflow/tfjs";

export const objectToTensor = (data) => {
  const tensorData = Object.entries(data).map((items) => (
    tf.tensor(items[1]).reshape([-1, 1])
  ))

  return tf.concat(tensorData, 1);
}

export function convertToTensor(xs, ys) {
    console.log('Convert Array To Tensor');
  
    return tf.tidy(() => {
      // 텐서로 데이터 변환
      const inputTensor = objectToTensor(xs);
      const labelTensor = objectToTensor(ys);
  
      return {
        features: inputTensor,
        labels: labelTensor,
      }
    })
  }
  