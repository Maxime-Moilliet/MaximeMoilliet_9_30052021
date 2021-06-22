import { fireEvent, screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES } from "../constants/routes"
import { localStorageMock } from "../__mocks__/localStorage.js"
import firebase from "../__mocks__/firebase"
import BillsUI from "../views/BillsUI.js"

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page and i add a new file (image)", () => {    
    test("Then user change input file and input file is valid, this function(handleChangeFile) is called", () => {

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      Object.defineProperty(window, "localStorage", {
        value: localStorageMock
      })

      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee"
        })
      )
 
      document.body.innerHTML = NewBillUI()

      const newBill = new NewBill({
        document,
        onNavigate,
        firestore: null,
        localStorage: window.localStorage,
      })

      const handleChangeFile = jest.fn(newBill.handleChangeFile)
      const inputFile = screen.getByTestId("file")
      inputFile.addEventListener("change", handleChangeFile)
      fireEvent.change(inputFile, {
        target: {
          files: [new File(["image"], "image.jpg", { 
            type: "image/jpg" 
          })]
        }
      })
      expect(handleChangeFile).toHaveBeenCalled()
      expect(inputFile.files[0].name).toBe("image.jpg")
    })

    test("Then user change input file and input file is not Valid, so input value file is reset", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      Object.defineProperty(window, "localStorage", {
        value: localStorageMock
      })

      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee"
        })
      )
 
      document.body.innerHTML = NewBillUI()

      const newBill = new NewBill({
        document,
        onNavigate,
        firestore: null,
        localStorage: window.localStorage
      })

      const handleChangeFile = jest.fn(newBill.handleChangeFile)
      const inputFile = screen.getByTestId("file")
      inputFile.addEventListener("change", handleChangeFile)
      fireEvent.change(inputFile, {
        target: {
          files: [new File(["image"], "image.txt", { 
            type: "text/plain" 
          })]
        }
      })
      expect(handleChangeFile).toHaveBeenCalled()
      expect(inputFile.value).toBe("")
    })

    test("Then onSubmit form New Bill function(handleSubmit) is called and create new bill", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      Object.defineProperty(window, "localStorage", {
        value: localStorageMock
      })
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee"
        })
      )

      const html = NewBillUI()
      document.body.innerHTML = html

      const newBill = new NewBill({
        document,
        onNavigate,
        firestore: null,
        localStorage: window.localStorage
      })

      const handleSubmit = jest.fn(newBill.handleSubmit)
      const submitBtn = screen.getByTestId("form-new-bill")
      submitBtn.addEventListener("submit", handleSubmit)
      fireEvent.submit(submitBtn)
      expect(handleSubmit).toHaveBeenCalled()
    })
  })
})

// test integration POST
describe("Given I am connected as an employee", () => {
  describe("When I navigate to NewBill and i create new Bill", () => {
    test("post newBill from mock API POST", async () => {
       const postSpy = jest.spyOn(firebase, "post")
       const newBill = {
          id: "grdfgyh4rt54hy5rf1h",
          name: "bill 3",
          email: "johndoe@email.com",
          type: "Transports",
          vat: "25",
          pct: 15,
          commentAdmin: "Facturation à valider",
          amount: 250,
          status: "refused",
          date: "2020-04-15",
          commentary: "Facturation à valider",
          fileName: "preview-facture-1.jpg",
          fileUrl: "https://firebasestorage.googleapis.com/v0/b/billable-677b6.appspot.com/o/justificatifs%2Fpreview-facture-1.jpg?alt=media&token=90b9b077-26e5-49e8-a48c-13fdea7dcae7"
       }
       const bills = await firebase.post(newBill)
       expect(postSpy).toHaveBeenCalledTimes(1)
       expect(bills.data.length).toBe(5)
    })

    test("post newBill from an API and fails with 404 message error", async () => {
      firebase.post.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 404"))
      )
      document.body.innerHTML = BillsUI({ error: "Erreur 404" })
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })

    test("post newBill from an API and fails with 500 message error", async () => {
      firebase.post.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 500"))
      )
      document.body.innerHTML = BillsUI({ error: "Erreur 500" })
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })
})