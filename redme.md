<!-- async function getIdeas(id) {
  const personRef = doc(collection(db, "people"), id);
  const q = query(
    collection(db, "gift-ideas"),
    where("person-id", "==", personRef)
  );
  const querySnapshot = await getDocs(doc);

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const id = doc.id;
    // console.log(data);
    giftList.push({ id, ...data });

    return data;
  });

  buildGift();
} -->
