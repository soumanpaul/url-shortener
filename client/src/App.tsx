import React, { useState, useEffect } from 'react'
import axios, { AxiosResponse, AxiosError } from 'axios'
import './App.css'

function App() {
  const [url, setUrl] = useState<string>('')
  const [shortenUrl, setShortenUrl] = useState<{ url: string, view: Number }[]>([])
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [disableButton, setDisableButton] = useState<boolean>(false)
  const [copiedText, setCopiedText] = useState<string>('')

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/`)
      .then((response: AxiosResponse) => {
        console.log("Response...", response.data.url)
        if (response?.status == 200) {
          setShortenUrl(response.data.url)
          setDisableButton(true)
        }
        setLoading(false)
      })
      .catch((error: AxiosError) => {
        setLoading(false)
        setError(error?.response?.data?.error?.message)
      })
  }, [])


  const validateUrl = (text: string): boolean => {
    let url
    try {
      url = new URL(text)
    } catch (_) {
      return false
    }
    return url.protocol === 'http:' || url.protocol === 'https:'
  }

  const handleShorten = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault()
    if (url.trim() && validateUrl(url)) {
      setError('')
      setShortenUrl([])
      setLoading(true)
      axios
        .post(`${process.env.REACT_APP_API_BASE_URL}/`, { url })
        .then((response: AxiosResponse) => {
          if (response?.data?.success) {
            setShortenUrl(response?.data?.data?.url)
            setDisableButton(true)
          }
          setLoading(false)
        })
        .catch((error: AxiosError) => {
          setLoading(false)
          setError(error?.response?.data?.error?.message)
        })
    } else {
      setError('Please enter a valid URL!')
    }
  }
  console.log(shortenUrl)
  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setUrl(e.target.value)
    setShortenUrl([])
    setDisableButton(false)
    setCopiedText('')
  }

  const handleCopy = (url: string): void => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedText(url)
    })
  }

  return (
    <div>
      <div className="content-wrapper">
        <h1 className="page-title"> URL Shortener</h1>
        <p className="page-description">
          URL shortener application built with NodeJs,
          MongoDB, ReactJs, TypeScript, and Docker.
        </p>
        <div className="form-wrapper">
          <div className="input-wrapper">
            <input
              onChange={handleChangeInput}
              value={url}
              placeholder="https://..."
            />
            {error && <p className="error">{error}</p>}
          </div>
          <button disabled={loading || disableButton} onClick={handleShorten}>
            {loading ? 'Load...' : 'Shorten'}
          </button>
        </div>
        {shortenUrl.length &&
          <>
            <h3 className="result-title">Shorten URL:</h3>
            {shortenUrl.map((item, index) => (
              <>
                <div className="result-link-wrapper">
                  <a
                    target="_blank"
                    rel="noreferrer"
                    className="shorten-url"
                    href={item.url} >
                    {item.url}
                  </a>
                  <button onClick={() => handleCopy(item.url)} className="copy-button">
                    {copiedText === item.url ? 'Copied!' : 'Copy'}
                  </button>
                  <div className="view-style">
                    Viewed {item.view} times
                  </div>
                </div>
              </>
            ))}
          </>}
      </div>
    </div>
  )
}

export default App
