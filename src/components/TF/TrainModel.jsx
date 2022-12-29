import { createOptimizer } from "./CreateModel"; 
import * as tf from "@tensorflow/tfjs";

export async function trainModel(model, xs, ys, compile, parameter) {
  /* 
    parameter:
      model: tf.model or tf.sequential
      xs: tf.tensor
      ys: tf.tensor
      compile: { optimizer: {}, loss: "" }
      parameter: { epoch: number, batchSize: number }

    return:
      { 
        history: tf history object,
        trainedModel: tf.model or tf.sequential
      }
  */
 
 console.log("set model compile");
  model.compile({
    optimizer: createOptimizer(compile.optimizer),
    loss: compile.loss,
    metrics: [compile.metrics]
  })

  
  console.log("getting train model");
  const history = await model.fit(xs, ys, {
    ...parameter,
    shuffle: true,
  });

  return {
    "history": history, 
    "trainedModel": model}
};  