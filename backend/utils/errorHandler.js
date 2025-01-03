function handleErrors(risk) {
  try {
    risk;
  } catch (err) {

    console.log(`${err.message}`);
  }
}
